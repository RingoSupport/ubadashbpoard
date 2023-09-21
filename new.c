#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define TRUE 1

typedef unsigned char u8;

int base64_decode_alloc(const char* src, size_t src_len, char** dst, size_t* dst_len) {
    // Implement your base64 decoding logic here
    // This function should decode the input 'src' and store the result in 'dst'
    // Set 'dst_len' to the length of the decoded data
    // Return TRUE on success, or FALSE on failure
    // You can use existing libraries or write your own base64 decoder
    return TRUE;
}

int transferPrintHex2HexTest(u8* byte, int* inoutLen, const char* printHex, int len) {
    // Implement your transferPrintHex2HexTest function here
    // This function should convert the hex-encoded input 'printHex' into binary data
    // The result should be stored in 'byte', and 'inoutLen' should be set to the length of the binary data
    // Return 0 on success, or -1 on failure
    return 0;
}

static int my_log_buf(const char* prefix, unsigned char* buf, int len) {
    // Implement your log function to display a hexadecimal buffer
    // You can customize the logging format as needed
    int i = 0;
    if (prefix) {
        printf(prefix);
    }
    for (i = 0; i < len; i++) {
        printf("%02x", buf[i]);
    }
    printf("\n");
    return 0;
}

static int my_log_string(const char* prefix, unsigned char* buf, int len) {
    // Implement your log function to display a string buffer
    // You can customize the logging format as needed
    int i = 0;
    if (prefix) {
        printf(prefix);
    }
    for (i = 0; i < len; i++) {
        printf("%c", buf[i]);
    }
    printf("\n");
    return 0;
}

void reverseXOR(char* encoded, int encodedLen, char* maskerKey, int maskerKeyLen) {
    for (int i = 0; i < encodedLen; i++) {
        encoded[i] = encoded[i] ^ maskerKey[i % maskerKeyLen];
    }
}

int main(int argc, char** argv) {
    if (argc != 3) {
        printf("Usage: %s <encoded_string> <masker_key>\n", argv[0]);
        return 1;
    }

    char* input = argv[1];
    char* masker = argv[2];

    size_t b64enclen = 0;
    char* b64enc = NULL;

    // base64 decoding
    if (TRUE != base64_decode_alloc(input, strlen(input), &b64enc, &b64enclen)) {
        printf("base64_decode_alloc fail\n");
        return -1;
    }

    u8 masker_key[4];
    int masker_key_len = sizeof(masker_key) / sizeof(u8);
    transferPrintHex2HexTest(masker_key, &masker_key_len, masker, strlen(masker));

    // unmask
    u8* transformed_octet_i = (u8*)b64enc;
    for (int i = 0; i < b64enclen; i++) {
        *transformed_octet_i = *(u8*)(b64enc + i) ^ (masker_key[i % 4]);
        transformed_octet_i++;
    }

    printf("Decoded string: %s\n", b64enc);

    free(b64enc);

    return 0;
}
