/**
 * microbit Makecode extensions for Ultimate SR04 RGB ultrasonic sensor
 */

namespace sgbotic {

    export enum LedEnum {
        //%block="red"
        Red = 1,
        //%block="green"
        Green = 2,
        //%block="blue"
        Blue = 3
    }

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
       * To set the color and light intensity of the RGB LEDs
       */
    export function fnRGB(color: LedEnum, power: number, i2cAddr: number) {
        let buf2 = pins.createBuffer(2);

        if (color == LedEnum.Red) {
            buf2[0] = redRegister;
        } else if (color == LedEnum.Green) {
            buf2[0] = greenRegister;
        } else if (color == LedEnum.Blue) {
            buf2[0] = blueRegister;
        }
        buf2[1] = power;

        pins.i2cWriteBuffer(i2cAddr, buf2);
        //basic.pause(10)
    }

    /**
       * To turn off all LEDs
       */
    export function fnOffAllLeds(i2cAddr: number) {
        let buf2 = pins.createBuffer(2);

        buf2[1] = 0;

        buf2[0] = redRegister;
        pins.i2cWriteBuffer(i2cAddr, buf2);
        basic.pause(10)

        buf2[0] = greenRegister;
        pins.i2cWriteBuffer(i2cAddr, buf2);
        basic.pause(10)

        buf2[0] = blueRegister;
        pins.i2cWriteBuffer(i2cAddr, buf2);
        basic.pause(10)
    }

    /**
       * Ask ultrasonic sensor to send ping wave
       */
    export function fnTrigger(i2cAddr: number) {
        let buf2 = pins.createBuffer(2);

        buf2[0] = 0x01;

        pins.i2cWriteBuffer(i2cAddr, buf2);
        //basic.pause(1)
    }

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

    /**
      * Read the measured distance in micro-seconds
      */
    export function fnReadus(i2cAddr: number): number {
        let us: number;

        pins.i2cWriteNumber(i2cAddr, resultUs, NumberFormat.UInt8BE)
        basic.pause(1)
        let readbuf = pins.i2cReadBuffer(i2cAddr, pins.sizeOf(NumberFormat.UInt8LE) * 2)

        us = (readbuf[0] * 256 + readbuf[1]);
        return (us)
    }

    /**
       * Read the firmware version
       */
    export function fnVersion(i2cAddr: number): number {
        pins.i2cWriteNumber(i2cAddr, firmwareVersion, NumberFormat.UInt8BE)
        basic.pause(1)
        let readbuf = pins.i2cReadBuffer(i2cAddr, pins.sizeOf(NumberFormat.UInt8LE) * 1)
        basic.pause(1)
        return (readbuf[0])
    }

    /**
   * set the I2C address of SR04 RGB
   */
    //% subcategory=SR04-RGB
    //% group="single SR04-RGB"
    //% blockId="initialize" block="initialize SR04addr%addr"
    //% addr.defl=0x57
    //% addr.min=0x08 addr.max=0x71
    //% weight=99 blockGap=20 color=3CB371
    export function initialize(addr: number) {
        i2cAddr = addr;
    }

    /**
   * switch off all leds
   */
    //% subcategory=SR04-RGB
    //% group="single SR04-RGB"
    //% blockId="offAllLeds" block="off all led"
    //% weight=97 blockGap=20 color=3CB371
    export function offAllLeds() {
        fnOffAllLeds(i2cAddr);
    }

    /**
    * set RGB color and light intensity
    */
    //% subcategory=SR04-RGB
    //% group="single SR04-RGB"
    //% blockId="colorLightIntensity" block="led%color|power %power"
    //% power.defl=125
    //% power.min=0 power.max=255
    //% weight=95 blockGap=20 color=3CB371
    export function colorLightIntensity(color: LedEnum, power: number) {
        fnRGB(color, power, i2cAddr);
        basic.pause(10);
    }


    /**
    * start measurement
    */
    //% subcategory=SR04-RGB
    //% group="single SR04-RGB"
    //% blockId="trigger" block="start measurement"
    //% weight=92 blockGap=20 color=3CB371
    export function trigger() {
        fnTrigger(i2cAddr);
        basic.pause(100);
    }



    /**
     * Read sensor in cm.
     */
    //% subcategory=SR04-RGB
    //% group="single SR04-RGB"
    //% blockId="readcm" block="mm"
    //% weight=90 blockGap=20 color=3CB371
    export function readcm(): number {
        let cm: number = fnReadCm(i2cAddr);
        basic.pause(10);
        return (cm)
    }

    /**
     * Read sensor in micro-second.
     */
    //% subcategory=SR04-RGB
    //% group="single SR04-RGB"
    //% blockId="readUs" block="uS"
    //% weight=88 blockGap=20 color=3CB371
    export function readUs(): number {
        let us: number = fnReadus(i2cAddr);
        basic.pause(10);
        return (us)
    }



    /**
     * Read firmware version.
     */
    //% subcategory=SR04-RGB
    //% group="single SR04-RGB"
    //% blockId="readVersion" block="version"
    //% weight=86 blockGap=40 color=#3CB371
    export function readVersion(): number {
        let ver_value: number = fnVersion(i2cAddr);
        basic.pause(10);
        return (ver_value)
    }

    /**
       * switch off all leds
       */
    //% subcategory=SR04-RGB
    //% group="multiple SR04-RGB"
    //% blockId="offAllLedMultiSr04" block="off all led addr%addr"
    //% addr.defl=0x60
    //% addr.min=0x08 addr.max=0x71
    //% weight=70 blockGap=20 color=73A16C
    export function offAllLedMultiSr04(addr: number) {
        fnOffAllLeds(addr);
    }

    /**
    * set RGB color and light intensity of specified sensor
    */
    //% subcategory=SR04-RGB
    //% group="multiple SR04-RGB"
    //% blockId="colorLightIntensityMultiSr04" block="led%color |power %power addr%addr"
    //% power.defl=125
    //% power.min=0 power.max=255
    //% addr.defl=0x60
    //% addr.min=0x08 addr.max=0x71
    //% weight=68 blockGap=20 color=73A16C
    export function colorLightIntensityMultiSr04(color: LedEnum, power: number, addr: number) {
        fnRGB(color, power, addr);
        basic.pause(10);
    }


    /**
        * start measurement of specified sensor
        */
    //% subcategory=SR04-RGB
    //% group="multiple SR04-RGB"
    //% blockId="triggerMultiSr04" block="start measurement addr%addr"
    //% addr.defl=0x60
    //% addr.min=0x08 addr.max=0x71
    //% weight=66 blockGap=20 color=73A16C
    export function triggerMultiSr04(addr: number) {
        fnTrigger(addr)
        basic.pause(10);
    }



    /**
     * Read sensor in  of specified sensor
     */
    //% subcategory=SR04-RGB
    //% group="multiple SR04-RGB"
    //% blockId="readCmMultiSr04" block="cm addr%addr"
    //% addr.defl=0x60
    //% addr.min=0x08 addr.max=0x71
    //% weight=64 blockGap=20 color=73A16C
    export function readCmMultiSr04(addr: number): number {
        let cm: number = fnReadCm(addr);
        basic.pause(10);
        return (cm)
    }

    /**
     * Read sensor in micro-second of specified sensor
     */
    //% subcategory=SR04-RGB
    //% group="multiple SR04-RGB"
    //% blockId="readUsMultiSr04" block="uS addr%addr"
    //% addr.defl=0x60
    //% addr.min=0x08 addr.max=0x71
    //% weight=62 blockGap=20 color=73A16C
    export function readUsMultiSr04(addr: number): number {
        let us: number = fnReadus(addr);
        basic.pause(10);
        return (fnReadus(addr))
    }


    /**
     * Read firmware version of specified sensor
     */
    //% subcategory=SR04-RGB
    //% group="multiple SR04-RGB"
    //% blockId="readVersionMultiSr04" block="version addr%addr"
    //% addr.defl=0x60
    //% addr.min=0x08 addr.max=0x71
    //% weight=60 blockGap=40 color=#73A16C
    export function readVersionMultiSr04(addr: number): number {
        let ver_value: number = fnVersion(addr)
        basic.pause(10);
        return (ver_value)
    }

    /**
   * change I2C address
   */
    //% subcategory=SR04-RGB
    //% group="advanced"
    //% blockId="changeAddr" block="change I2C addr from %oldAddr to %newAddr"
    //% oldAddr.defl=0x60
    //% oldAddr.min=0x08 oldAddr.max=0x77
    //% newAddr.defl=0x56
    //% newAddr.min=0x08 newAddr.max=0x77
    //% weight=100 blockGap=40 color=#046307
    export function changeAddr(oldAddr: number, newAddr: number) {
        let newI2CAddr: number = newAddr;
        let buf2 = pins.createBuffer(2);

        buf2[0] = newI2cAddrCmd;
        buf2[1] = newI2CAddr;

        pins.i2cWriteBuffer(oldAddr, buf2);
        basic.pause(10)
    }
}