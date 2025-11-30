import ssl

# config ssl connection w Transport Layer Security encryption (no cert)
context = ssl.SSLContext(
    ssl.PROTOCOL_TLS_CLIENT
)  # TLS_CLIENT = connect as client not server/broker
context.verify_mode = (
    ssl.CERT_NONE
)  # CERT_NONE = not verify server/broker cert - CERT_REQUIRED: verify

# config ssl connection w Transport Layer Security encryption (cert required)
# context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
# context.verify_mode = ssl.CERT_REQUIRED
# context.load_verify_locations('ccertificate.pem') # Load the certificate from path
