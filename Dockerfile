FROM httpd:2.4

# Install Apache Benchmark
RUN apt-get update && \
    apt-get install -y apache2-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
WORKDIR /usr/src/app

CMD ["tail", "-f", "/dev/null"]
