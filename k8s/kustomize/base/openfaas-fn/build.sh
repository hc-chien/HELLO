#!/usr/bin/env sh
# l=`kubectl get deploy  -o yaml | egrep -A1 node | grep image | cut -f3 -d '/' | cut -f 1 -d ':'`
# kubectl get deploy  -o yaml | grep image | grep -v Pull | cut -f 2 -d : | sed "s/.*\///g"`
l=`cat func_list.txt`

mkdir tmp
for i in $l
do
	rm -rf $i
	echo "creating \"$i\" ..."
	if [ ! -d $i ]; then
        mkdir $i
    fi

#	rm $i/faas.yaml
#    ln "faas.yaml" $i

	cat <<EOF > tmp/kustomization.yaml
kind: Kustomization
bases:
- ../__basic

#resources:
#- faas.yaml

generatorOptions:
  disableNameSuffixHash: true

images:
- name: __IMAGE
  newName: dockerhub.pentium.network/jhow-gde/$i
  newTag: 1.0.0

patchesJson6902:
- target:
    group: extensions
    version: v1beta1
    kind: Deployment
    name: __FUNC_NAME
  path: patchDeployment.json
- target:
    version: v1
    kind: Service
    name: __FUNC_NAME
  path: patchService.json
EOF

	cat <<EOF > tmp/patchDeployment.json
[
	{"op": "replace", "path": "/metadata/labels", "value": "$i"},
	{"op": "replace", "path": "/metadata/name", "value": "$i"},
	{"op": "replace", "path": "/spec/selector/matchLabels/faas_function", "value": "$i"},
	{"op": "replace", "path": "/spec/template/metadata/labels", "value": "$i"},
	{"op": "replace", "path": "/spec/template/metadata/name", "value": "$i"},
	{"op": "replace", "path": "/spec/template/spec/containers/0/name", "value": "$i"},
	{"op": "replace", "path": "/spec/template/spec/containers/0/volumeMounts/0/name", "value": "$i-projected-secrets"},
	{"op": "replace", "path": "/spec/template/spec/volumes/0/name", "value": "$i-projected-secrets"}
]
EOF

	cat <<EOF > tmp/patchService.json
[
	{"op": "replace", "path": "/metadata/name", "value": "$i"},
	{"op": "replace", "path": "/spec/selector/faas_function", "value": "$i"}
]
EOF

cd tmp; kustomize build > ../$i/faas.yaml; cd ..
cp __basic/kustomization.yaml $i/

done

rm -rf tmp
