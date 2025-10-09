#/bin/sh

multipass delete k8s-control-plane
multipass delete k8s-worker-1
multipass delete k8s-worker-2
multipass purge

rm -f .ssh/id_ed25519 .ssh/id_ed25519.pub && \
ssh-keygen -t ed25519 -f .ssh/id_ed25519 -N '' -C "ansible" -q

chmod 600 .ssh/id_ed25519
chmod 600 .ssh/id_ed25519.pub
chmod 700 .ssh

multipass launch 24.04 -n k8s-control-plane -m 4G -c 4 -d 20G
multipass launch 24.04 -n k8s-worker-1 -m 2G -c 2 -d 20G
multipass launch 24.04 -n k8s-worker-2 -m 2G -c 2 -d 20G

multipass exec k8s-control-plane -- bash -c "echo '$(cat .ssh/id_ed25519.pub)' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && mkdir -p ~/.ssh && chown -R ubuntu:ubuntu ~/.ssh"
multipass exec k8s-worker-1  -- bash -c "echo '$(cat .ssh/id_ed25519.pub)' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && mkdir -p ~/.ssh && chown -R ubuntu:ubuntu ~/.ssh"
multipass exec k8s-worker-2  -- bash -c "echo '$(cat .ssh/id_ed25519.pub)' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && mkdir -p ~/.ssh && chown -R ubuntu:ubuntu ~/.ssh"
