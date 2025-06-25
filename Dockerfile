FROM ghcr.io/gohugoio/hugo AS builder

WORKDIR /site
COPY . .
RUN hugo --minify

FROM nginx:alpine

COPY --from=builder /site/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
