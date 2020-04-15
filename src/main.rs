use actix_files as fs;
use actix_web::{web, App, HttpServer, HttpResponse, Responder};
use tera::{Tera, Context};


async fn render_tmpl(data: web::Data<AppData>) -> impl Responder {
    let ctx = Context::new();
    let rendered = data.tmpl.render("index.html", &ctx).unwrap();
    HttpResponse::Ok().body(rendered)
}

struct AppData {
    tmpl: Tera
}


#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let tera =
            Tera::new(
                concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*")
            ).unwrap();

        App::new()
            .data(AppData {tmpl: tera})
            .service(fs::Files::new("/static", ".").show_files_listing())
            .service(
                web::resource("/")
                    .route(web::get().to(render_tmpl))
            )
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}