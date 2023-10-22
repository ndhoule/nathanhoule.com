# vi:ft=hcl

variable "image_tag" {
  type = string
}

job "personal-website" {
  type = "service"

  group "service" {
    network {
      mode = "bridge"

      port "http" {
        to = 3000
      }
    }

    service {
      name = "personal-website-http"
      port = 3000

      check {
        expose   = true
        type     = "http"
        path     = "/"
        interval = "15s"
        timeout  = "2s"
      }

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "immich-server"
              local_bind_port  = 8000
            }
          }
        }
      }
    }

    task "service" {
      driver = "docker"

      config {
        image = "ndhoule/nathanhoule.com:${var.image_tag}"

        ports = ["http"]
      }

      resources {
        cpu        = 500
        memory     = 1024
        memory_max = 2048
      }

      vault {
        env      = false
        policies = ["app_personal_website"]
      }

      template {
        change_mode = "restart"
        destination = "${NOMAD_SECRETS_DIR}/env"
        env         = true

        data = <<EOF
GARMIN_MAPSHARE_MAP_ID={{ with secret "secret/data/app_personal_website" }}{{ .Data.data.garmin_mapshare_map_id | toJSON }}{{ end }}
GARMIN_MAPSHARE_PASSWORD={{ with secret "secret/data/app_personal_website" }}{{ .Data.data.garmin_mapshare_password | toJSON }}{{ end }}
IMMICH_ADDR=http://{{ env "NOMAD_UPSTREAM_ADDR_immich_server" | toJSON }}
IMMICH_ALBUM_ID_WHITELIST={{ with secret "secret/data/app_personal_website" }}{{ .Data.data.immich_album_id_whitelist | toJSON }}{{ end }}
IMMICH_API_KEY={{ with secret "secret/data/app_personal_website" }}{{ .Data.data.immich_api_key | toJSON }}{{ end }}
EOF
      }
    }
  }
}