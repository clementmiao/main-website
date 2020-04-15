use actix_files as fs;
use actix_web::http::{StatusCode};
use actix_web::{web, App, HttpServer, HttpResponse, Responder, Result};
use tera::{Tera, Context};
use listenfd::ListenFd;


async fn index(data: web::Data<AppData>) -> impl Responder {
    let ctx = Context::new();
    let rendered = data.tmpl.render("index.html", &ctx).unwrap();
    HttpResponse::Ok().body(rendered)
}

async fn command_palette() -> Result<HttpResponse> {
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../static/command_palette.html")))
}

struct AppData {
    tmpl: Tera
}


#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let mut listenfd = ListenFd::from_env();

    let mut server = HttpServer::new(|| {
        let mut tera =
                Tera::new(
                    concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*")
                ).unwrap();

        tera.autoescape_on(vec!["html"]);

        App::new()
            .data(AppData {tmpl: tera})
            .service(fs::Files::new("/static", ".").show_files_listing())
            .service(
                web::resource("/")
                    .route(web::get().to(index))
            )
            .service(
                web::resource("/command")
                    .route(web::get().to(command_palette))
            )
    });

    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(l)?
    } else {
        server.bind("0.0.0.0:8000")?
    };

    server.run().await
}