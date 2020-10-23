# youtube-dl-web

a minimal web ui and serverless api for [youtube-dl](https://github.com/ytdl-org/youtube-dl).

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/saanuregh/youtube-dl-web)

## How to use the serverless API

### To download

`/api/download`

#### parameters

- `url` - url to the media, no playlists (required)
- `f` - format as per youtube-dl format (default: bestvideo+bestaudio/best)

### To get info

`/api/info`

#### parameters

- `q` - search query or url (required)
- `f` - format as per youtube-dl format (default: bestvideo+bestaudio/best)
