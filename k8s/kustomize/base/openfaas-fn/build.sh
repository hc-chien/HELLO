l=`kubectl get deploy  -o yaml | egrep -A1 node | grep image | cut -f3 -d '/' | cut -f 1 -d ':'`
for i in $l
do
	echo "creating \"$i\" ..."
	if [ ! -d $i ]; then
        mkdir $i
    fi

	cat <<EOF > $i/kustomization.yaml
kind: Kustomization
bases:
- ../__basic

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
  path: patch.json
EOF

	cat <<EOF > $i/patch.json
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
done
