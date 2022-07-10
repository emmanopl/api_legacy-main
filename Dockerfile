FROM node:18-slim

WORKDIR /usr/src/app

COPY . .

RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV NODE_OPTIONS --max-old-space-size=4096

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm build

ENV MONGO_DB_CONN_STRING "mongodb+srv://dev:dev@uibox-dev.wtl7h.mongodb.net/dev?retryWrites=true&w=majority"
ENV MONGO_DB_NAME "dev"
ENV PORT "8080"
ENV HOST "0.0.0.0"
ENV AWS_ACCESS_KEY_ID "AKIAUX2KHYHGDZIF34E4"
ENV AWS_SECRET_ACCESS_KEY "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"
ENV AWS_BUCKET_NAME "uibox-dev"
ENV CDN_BASE "https://ik.imagekit.io/scenify/"
ENV PROXY_BASE "https://api.scenify.io"
ENV GOOGLE_FONTS_API_KEY "AIzaSyDjFrA7VqnUa-Mt8yYUrmOj_-0fx_snAnw"
ENV PIXABAY_KEY "20824871-7548337191755cbbef05230ed"
ENV PEXELS_KEY "563492ad6f9170000100000106a307bb7f744a0babfd5e7885d9a620"
ENV ICONSCOUT_SECRET "yOjZGSOOyglJYWH1RsZsXs7MyLOcaaHR"
ENV ICONSCOUT_CLIENT_ID "148500809558785"

ENV GOOGLE_CLIENT_ID "326673198293-l066212ppihmocqd7194n5bife4f3ise.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET "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"
ENV GOOGLE_CLIENT_REDIRECT_URL "https://api.scenify.io/auth/google/callback"
ENV FACEBOOK_CLIENT_ID "1006547879906909"
ENV FACEBOOK_CLIENT_SECRET "6ea29534d30503e746e68a051b70d55a"
ENV FACEBOOK_CLIENT_REDIRECT_URL "https://api.scenify.io/auth/facebook/callback"
ENV CLIENT_AUTH_REDIRECT "https://diifferweb.netlify.app/redirect"

EXPOSE 8080

CMD [ "pnpm", "start" ]