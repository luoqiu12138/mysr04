/**
 * microbit Makecode extensions for Ultimate SR04 RGB ultrasonic sensor
 */

namespace sgbotic {

 
    let i2cAddr = 0x60;

    let rgbRegister: number = 0x02;
    let redRegister: number = rgbRegister
    let greenRegister: number = redRegister + 1;
    let blueRegister: number = greenRegister + 1;

    let triggerRegister: number = 0x01;
    let triggerCmd: number = 0x01;

    let resultCm: number = 0x01;
    let resultUs: number = 0X0C

    let newI2cAddrCmd: number = 0xE0;
    let firmwareVersion: number = 0xF0;


    /**
       * Read the measured distance in centimeters
       */
    export function fnReadCm(i2cAddr: number): number {
        let mm: number;

        pins.i2cWriteNumber(0XAE,0X01, NumberFormat.UInt8BE)
        basic.pause(100)
        let readbuf = pins.i2cReadBuffer(0XAF, pins.sizeOf(NumberFormat.UInt8LE) * 3)
        mm = (readbuf[0] * 65535 + readbuf[1]*256+readbuf[2])/1000;
        return (mm)
    }

}