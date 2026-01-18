# Use the official Golang image for building
FROM golang:1.25.5 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main . || (echo "Build failed!" && exit 1)

# Use a minimal base image for final deployment
FROM alpine:latest

# Create a non root user
RUN addgroup -S gogroup && adduser -S gouser -G gogroup

WORKDIR /root/

# Add this necessary library to run go bin in alpine
RUN apk --no-cache add libc6-compat

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

RUN chown -R gouser:gogroup /root

# Switch to non root user
USER gouser

# Expose the application port
EXPOSE 8080

CMD ["./main"]
