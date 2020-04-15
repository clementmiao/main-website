# main-website

## Steps
- `docker build --rm -f "Dockerfile" -t mainwebsite:latest "."`
- `docker run --rm -d -p 80:8000  mainwebsite:latest`
- go to `localhost:80`