---
title: "Sync an Android phone’s system clock to a computer’s clock using ADB"
date: "2022-10-23"
summary: "So I’ve lately been trying to synchronize an Android phone’s clock to the computer clock, and it has turned out to be quite a headache to get it working correctly. In this blog post, I’ll describe my findings and hustles in case you need something similar."
draft: false
showSummary: true
showReadingTime: true
showTableOfContents: true
---
{{<figure src="./thumb-phone-clock.jpg" title="phone-clock">}}

So I’ve lately been trying to synchronize an Android phone’s clock to the computer clock, and it has turned out to be quite a headache to get it working correctly. In this blog post, I’ll describe my findings and hustles in case you need something similar. Hopefully, it will save you several hours of work and your boss will be happier than mine. Anyways, let’s get to it:

I wanted the phone’s system clock to be synchronized to a Linux computer’s with an error of ± 10 milliseconds. However, I’m pretty sure you can get something similar working on Mac or even a Windows machine with some tweaking. In the latter, you might need to install the [Windows subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install). You can find all the code from this tutorial on [my GitHub](https://github.com/JorgeSintes/android_sync).

## First things first, the phone
Sad news: for this to work, you’ll need a rooted android phone. Access to set the system time programmatically is restricted on Android phones by default. I’m by no means an expert on rooting android devices, and the process varies from one brand to another. I recommend you look online for a rooting tutorial for your specific phone model. **Google Pixel phones** are known for being as easy as it gets to root. Personally, I did it with the cheapest phone I could get my hands on, a **Xiaomi RedMi 9A**. Xiaomi makes the rooting process a bit annoying, they make you wait one week to be able to unlock the bootloader, and it can be tricky to find a recovery image that works, especially if your device is not that common, as it was my case. Most guides recommend using [TWRP recovery](https://www.xda-developers.com/how-to-install-twrp/), but my model wasn’t supported. [OrangeFox recovery](https://forum.xda-developers.com/t/recovery-official-orangefox-recovery-project-r11-1.3775933/) ended up working for me, but the screen wasn’t working 4 out of 5 times, and I had to reboot MANY times. Long story short: use a phone supported by TWRP, if possible. Otherwise, good luck!

## Using NTP: the easy option
I heard of the existence of an app called ClockSync [in this thread on the XDA developers’ forum](https://forum.xda-developers.com/t/app-clocksync-synchronize-device-time-via-ntp.688177/). The app lets you sync your Android system clock to an NTP server. Just [download the apk](http://amip.tools-for.net/android/clocksync) and install it. Even though it’s archaic (from 2010), it worked fine on my Android 11.3. It still needs the phone to be rooted (remember to give the app superuser permission), but it comes with some cool features: automatic sync with configurable interval, lets you choose the NTP server…

So, it’s just as simple as installing an NTP server on the computer and letting the app do the work for you, isn’t it? Well, in my case, it happened to not be precise enough. Since the connection between the phone and the computer is over WiFi, I was still experiencing too much delay. However, this might be a perfect solution for you if you don’t need so much accuracy. To get the NTP server working, just run the following:
```bash
sudo apt install ntp
sudo systemctl restart ntp
```

If you have a firewall, allow packets to access port 123. Then go to the ClockSync app, and in settings, change the NTP server to your computer’s IP address, which you can find by running the following:
```bash
hostname -I
```

## Using ADB: the not-so-easy option
So if the above option is not precise enough for you, fear not: there’s still something we can do about it. It will require some extra annoying (but cool!) steps, though. There’s this tool called Android Debug Bridge (ADB) (you probably used it during the rooting process) that can be used to access the shell on the phone. We’ll use it to do the synchronization over USB. Let’s go!

### Install ADB
First, in case you don’t have it, install ADB:
```bash
sudo apt install android-sdk-platform-tools-common
sudo apt install adb
```

Make sure you have USB debugging on your phone. Connect it to the computer and check everything is running with:
```bash
adb shell "echo 'hello world'"
```

If for whatever reason your phone is just charging, and not showing a pop-up notification with “Use USB for” just restart the phone or the computer and try again. If this doesn’t work try out a different port. The first time you try this on a computer, ADB will throw an “unauthorized” error message. A pop-up notification will show up on the phone asking if you want to allow that specific computer to have USB debugging rights. Tap yes and re-run the command. Also, some phones revoke the USB debugging keys if it’s been too long since the last time you connected to it, but you can disable this in the developer settings menu. If you see an error message complaining your user is not part of the plugdev group, run the following command and try again:
```bash
sudo usermod -aG plugdev $LOGNAME
```

**Note:** If you’re not running Linux, you might need to install an ADB USB driver. Follow the instructions [here](https://developer.android.com/studio/run/device).

## Setting and getting time
In the Android shell, there’s a program: date, that according to its help menu should allow setting time with a decimal point value of seconds. However, this is not true, and you can only set time up to seconds, which again would not be precise enough. Annoying, right? However, there’s an environment variable available in Linux and Android shells, `$EPOCHREALTIME`, that shows the system clock with a resolution of microseconds, so it should be possible to access it, no? Please…?

So, it turns out that this environment variable gets time using the kernel function `gettimeofday`. And there’s a `settimeofday` function too, supporting microseconds! You can read more about it [here](https://www.commandlinux.com/man-page/man2/gettimeofday.2.html). So I wrote two crappy C programs that use these kernel functions to get and set the time, returning or accepting a Unix timestamp with the decimal value. The setter function doesn’t do any checks so, what would happen if you set a negative time…?. I don’t know. And I don’t take any responsibility if you end up with a lovely expensive brick in your hands! Whatever, here’s the code for `get_time.c`:

```c
#include <stdio.h>
#include <sys/time.h>

int main(void)
{
    struct timeval tv;
    struct timezone tz;
    gettimeofday(&tv, &tz);
    printf("%d.%d\n", tv.tv_sec, tv.tv_usec);
    return 0;
}
```

And for `set_time.c`:
```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>

void set_time(time_t seconds, suseconds_t microseconds);

void set_time(time_t seconds, suseconds_t microseconds)
{
    struct timeval tv;
    tv.tv_sec = seconds;
    tv.tv_usec = microseconds;
    settimeofday(&tv, NULL);
}

int main(int argc, char *argv[])
{
    int seconds, microseconds;
    sscanf(argv[1], "%d.%d", &seconds, &microseconds);
    set_time(seconds, microseconds);
    return 0;
}
```

## Compiling and running
We’re close to being done, I swear! The last thing we need to do is to compile the C code, which we’re going to do on the phone. On the phone? Yes, on the phone! Isn’t that badass? For this purpose, install the Termux terminal emulator from the [F-Droid store](https://f-droid.org/en/packages/com.termux/). The app is also available on the [google play store](https://play.google.com/store/apps/details?id=com.termux&gl=US), but this version is not updated anymore and some things might not work with it, so I recommend the first one. Also, F-Droid is a very nice store for finding freeware for Android so you should definitely check it out! Termux is very cool; it lets you access the terminal on your phone and even comes with a package manager! We’ll use it to install GCC on it. We’ll also create a time directory where we’ll store everything. On Termux, run:
```bash
pkg install gcc
mkdir time
```

Let’s then get the files `set_time.c` and `get_time.c` on the phone. On the computer, run:
```bash
adb push set_time.c /data/data/com.termux/files/home/time/
adb push get_time.c /data/data/com.termux/files/home/time/
```

Back to the phone, run:
```bash
cd time
gcc set_time.c -o set_time
gcc get_time.c -o get_time
```

We finally have the compiled files on the phone, and we can run them from ADB. We can get the time from the computer and dump it on the phone by doing:
```bash
computer_time=$(date +%s.%6N)
adb shell "su -c '/data/data/com.termux/files/home/time/set_time $computer_time'"
phone_time=$(adb shell "su -c '/data/data/com.termux/files/home/time/get_time'")
echo "Computer time: $computer_time" 
echo "Phone time: $phone_time"
echo "Offset: $(echo $phone_time - $computer_time | bc)"
```

And there you go! We can now set the time through ADB. You can see there’s still some delay between the computer time and the set phone time. That’s because setting the time and reading it back takes some time. I wrote a bash script that checks what the offset is, `check_time_reset.sh`:
```bash
#!/bin/bash
# Checks the offset between phone's and computer's clock every second.
while true
do
    phone_time=$(adb shell "su -c '/data/data/com.termux/files/home/time/get_time'")
    current_time=$(date +"%s.%6N")
    diff=$(echo $phone_time-$current_time | bc)
    echo "[$(date -d @$current_time)] Offset: $diff" | tee -a log.txt
    sleep 1
done
```

And another to estimate the round trip time with several iterations and writes the time compensating for it. This assumes that reading is instantaneous compared to setting, but it ended up being good enough for my application. Here it is:
```bash
#!/bin/bash
# Program for synchronizing a phone's clock to a computer. Needs to have set_time.c and get_time.c compiled on the phone.
# It calculates the offset of writing and getting the time on the phone doing several trials (5 by default) and then 
# writes the time compensating it (assuming that get_time is negligible against set_time).
n=${1:-5}
echo "Synchronizing! Estimating offset with $n iterations" | tee -a log.txt
path="/data/data/com.termux/files/home/time" # path to set_time and get_time executables in the phone
offset=0 # Variable that will store the running avg of the offset
num_accepted=0
while [ $num_accepted -lt $n ]
do
    # Writing and reading the current time
    current_time=$(date +"%s.%6N")
    adb shell "su -c '$path/set_time $current_time'"
    phone_time=$(adb shell "su -c '$path/get_time'")
    current_time=$(date +"%s.%6N")
    # Calculate difference
    diff=$(echo $phone_time-$current_time | bc)
    # Only accept negative diffs. Sometimes adb takes longer to read the time from the phone and returns a great positive diff, which makes no sense
    if (( $(echo "$diff < 0" | bc -l) ))
    then 
        offset=$(echo "($num_accepted * $offset + $diff)/($num_accepted+1)"| bc -l)
        num_accepted=$(($num_accepted+1))
        # Print out
        echo "[$(date -d @$current_time)] It. $num_accepted. Offset: $diff. Running avg: $offset" | tee -a log.txt
    fi
    sleep 1
done
# Write compensating the offset
current_time=$(date +"%s.%6N")
offseted_time=$(echo "$current_time - $offset" | bc)
adb shell "su -c '$path/set_time $offseted_time'"
echo "[$(date -d @$current_time)] Synced!" | tee -a log.txt
./check_time_reset.sh
```

If you’ve been, thank you for reading! Again, all the code from this tutorial is available on [my GitHub](https://github.com/JorgeSintes/android_sync). Let me know if you find any errors or corrections or if this guide ends up being helpful to you!
