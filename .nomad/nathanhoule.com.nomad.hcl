#############
# Variables #
#############

variable "image" {
  type    = string
  default = "docker.io/ndhoule/nathanhoule.com"
}

variable "image_tag" {
  type = string
}

#############
# Job #
#############

job "personal-website" {
  type = "service"

  group "service" {
    count = 1

    network {
      mode = "bridge"

      port "http" {
        to = 3000
      }
    }

    update {
      max_parallel     = 1
      canary           = 1
      min_healthy_time = "30s"
      healthy_deadline = "2m"
      auto_revert      = true
      auto_promote     = true
    }

    service {
      name = "personal-website-http"
      port = 3000

      check {
        expose   = true
        type     = "http"
        path     = "/.well-known/healthcheck.json"
        interval = "10s"
        timeout  = "5s"

        check_restart {
          limit = 3
          grace = "15s"
        }
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
        image = "${var.image}:${var.image_tag}"

        ports = ["http"]
      }

      resources {
        cpu        = 250
        memory     = 512
        memory_max = 1024
      }

      vault {
        env = false
      }

      template {
        change_mode = "restart"
        destination = "${NOMAD_SECRETS_DIR}/env"
        env         = true

        data = <<EOF
GARMIN_MAPSHARE_MAP_ID="{{ with secret "secret/data/default/personal-website" }}{{ .Data.data.garmin_mapshare_map_id }}{{ end }}"
GARMIN_MAPSHARE_PASSWORD="{{ with secret "secret/data/default/personal-website" }}{{ .Data.data.garmin_mapshare_password }}{{ end }}"
HOSTNAME="127.0.0.1"
IMMICH_ADDR="http://{{ env "NOMAD_UPSTREAM_ADDR_immich_server" | toJSON }}"
IMMICH_ALBUM_ID_WHITELIST="{{ with secret "secret/data/default/personal-website" }}{{ .Data.data.immich_album_id_whitelist }}{{ end }}"
IMMICH_API_KEY="{{ with secret "secret/data/default/personal-website" }}{{ .Data.data.immich_api_key }}{{ end }}"
PORT="{{ env "NOMAD_PORT_http" }}"
EOF
      }
    }
  }
}
