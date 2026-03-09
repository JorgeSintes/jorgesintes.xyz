document.addEventListener("DOMContentLoaded", () => {
  const downloadLinks = document.querySelectorAll("[data-runtime-download-url]")

  async function fileExists(url) {
    try {
      let response = await fetch(url, { method: "HEAD", cache: "no-store" })

      if (response.status === 405) {
        response = await fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-0" },
          cache: "no-store",
        })
      }

      return response.ok
    } catch {
      return false
    }
  }

  downloadLinks.forEach(async (link) => {
    const url = link.dataset.runtimeDownloadUrl

    if (!url) {
      return
    }

    if (await fileExists(url)) {
      const container = link.closest("[data-runtime-download-container]")

      if (container) {
        container.hidden = false
      }
    }
  })
})
