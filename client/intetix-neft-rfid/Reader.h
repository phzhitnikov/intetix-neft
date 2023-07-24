#pragma once

#include <Arduino.h>
#include <MFRC522.h>

void dump_byte_array(byte *buffer, byte bufferSize) {
    for (byte i = 0; i < bufferSize; i++) {
        Serial.print(buffer[i] < 0x10 ? " 0" : " ");
        Serial.print(buffer[i], HEX);
    }
}

class Reader {
public:
public:
    Reader(const uint8_t reader_id,
           const uint8_t SS_PIN,
           const uint8_t RST_PIN)
            : id(reader_id),
              reader((SS_PIN, RST_PIN)) {}

    void init() {
        reader.PCD_Init();
        delay(4);  //  Some readers need some time to properly initialize

        Serial.print(F("Init rfid "));
        Serial.print(id);
        Serial.println();
    }

    void tick() {
        if (wasAttached && !isAnyCardPresent()) {
            // Print a "Reader 0: EMPTY" message

            Serial.print(F("Reader "));
            Serial.print(id);
            Serial.print(F(": EMPTY"));
            Serial.println();
            wasAttached = false;
            return;
        }

        bool hasNewCard = reader.PICC_IsNewCardPresent() && reader.PICC_ReadCardSerial();
        if (hasNewCard) {
            // Print a "Reader 0: C2 EF CB 2E" message

            Serial.print(F("Reader "));
            Serial.print(id);
            Serial.print(F(":"));
            dump_byte_array(reader.uid.uidByte, reader.uid.size);
            Serial.println();

            wasAttached = true;

            // Stop PICC
            reader.PICC_HaltA();
            // Stop encryption
            reader.PCD_StopCrypto1();
        }
    }

    // Source: https://github.com/Martin-Laclaustra/MFRC522-examples
    bool isAnyCardPresent() {
        byte bufferATQA[2];
        byte bufferSize = sizeof(bufferATQA);

        // Reset baud rates
        reader.PCD_WriteRegister(reader.TxModeReg, 0x00);
        reader.PCD_WriteRegister(reader.RxModeReg, 0x00);
        // Reset ModWidthReg
        reader.PCD_WriteRegister(reader.ModWidthReg, 0x26);

        MFRC522::StatusCode result = reader.PICC_WakeupA(bufferATQA, &bufferSize);
        return (result == MFRC522::STATUS_OK || result == MFRC522::STATUS_COLLISION);
    }

private:
    uint8_t id;
    MFRC522 reader;
    bool wasAttached = false;
};