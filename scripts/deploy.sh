#!/usr/bin/env sh

#
# Deploys a ndhoule/nathanhoule.com image on Docker Hub to Nomad.
#
# Usage:
#
# ```
# NOMAD_ADDR=https://{{nomad-address}} IMAGE_TAG={{ Image tag on Docker Hub }} ./deploy.sh
# ```
#

set -o errexit
set -o nounset

DRY_RUN=${DRY_RUN:-0}
IMAGE_TAG="${IMAGE_TAG:-}"
export NOMAD_ADDR="${NOMAD_ADDR}"

if [ -z "${IMAGE_TAG}" ]; then
  echo "IMAGE_TAG is missing. Aborting deployment."
  exit 1
fi

plan_output=$(
  nomad job plan \
    -var "image_tag=${IMAGE_TAG}" \
    .nomad/nathanhoule.com.nomad.hcl
) && plan_exit_code=$? || plan_exit_code=$?

if [ "${plan_exit_code}" = 255 ]; then
  echo "nomad plan failed. Aborting deployment."
  exit 1
fi

plan_check_index=$(echo "${plan_output}" | grep "Job Modify Index: " | sed "s/Job Modify Index: //" | xargs)

if [ -z "${plan_check_index}" ]; then
  echo "Could not extract check index from nomad plan. Aborting deployment."
  exit 1
fi

if [ "${DRY_RUN}" = 1 ] || [ "${DRY_RUN}" = "true" ]; then
  exit 0
fi

nomad job run \
  -check-index "${plan_check_index}" \
  -var "image_tag=${IMAGE_TAG}" \
  .nomad/nathanhoule.com.nomad.hcl
