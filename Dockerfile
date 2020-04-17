FROM rust:latest

WORKDIR /usr/src/main-website

RUN cargo build --release

RUN cargo install --path .

COPY . .

CMD ["/usr/local/cargo/bin/main-website"]