#include <Arduino.h>

#include <SPI.h>
#include <MFRC522.h>

#include "Reader.h"


#define READER_ID 1

#define SS_PIN 10
#define RST_PIN 9


Reader rfid(READER_ID, SS_PIN, RST_PIN);


void setup() {
    //  Serial interface to PC
    Serial.begin(9600);

    // Do nothing while Serial is initializing
    while (!Serial);

    SPI.begin();

    // Init the reader and present itself to the PC server
    rfid.init();
}


void loop() {
    rfid.tick();

}

