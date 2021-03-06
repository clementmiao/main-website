FROM rust:latest

WORKDIR /usr/src/main-website

COPY . .

RUN cargo build --release

RUN cargo install --path .

CMD ["/usr/local/cargo/bin/main-website"]