#!/usr/bin/env sh
l=`cat ../../../base/openfaas-fn/func_list.txt`

cat <<EOF > debug.yaml
kind: Kustomization

namespace: hello

secretGenerator:
- name: pn-faas-secret
  behavior: create
  files:
  - config.json
  type: Opaque

images:
EOF

for i in $l
do
	cat <<EOF >> debug.yaml
- name: __IMAGE/$i
  newName: dockerhub.pentium.network/jhow-gde/$i
  newTag: 1.0.0
EOF
done

cat <<EOF >> debug.yaml

bases:
EOF

for i in $l
do
	cat <<EOF >> debug.yaml
  - ../../../base/openfaas-fn/$i
EOF
done
