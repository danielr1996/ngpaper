version_settings(constraint='>=0.22.2')
k8s_yaml('deploy/kuard.yaml')
k8s_resource(
    'kuard',
    port_forwards='8080:8080',
    labels=['kuard']
)
k8s_yaml('deploy/helloworld.yaml')
k8s_resource(
    'helloworld',
    port_forwards='9090:80',
    labels=['helloworld']
)