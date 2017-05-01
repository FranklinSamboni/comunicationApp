/**
 * Created by Frank on 15/04/2017.
 */

let SOCKET_TOKEN = "";
let REST_TOKEN = "";

let ENABLE_REAL_TIME = false;
let AVALIBLE_FOR_REAL_TIME = false;

let CHANGE_SPS_IN_MAIN = false;

let AXIS = "";
const AXI_X = "BH2";
const AXI_Y = "BH1";
const AXI_Z = "BHZ";
const ALL_AXIS = '0';
const PATH_FILES = "/home/debian/Sensor-IOT/SensorIoT/muestras/";
const PATH_MAIN_PROGRAM = "/home/debian/Sensor-IOT/SensorIoT/Sensor/SensorIoT";
const PATH_SERIAL = "/home/debian/Sensor-IOT/SensorIoT/componentsFiles/serial.txt";

const SUCCESS = 1;
const ERROR = -1;

const URL_SOCKET = "https://socket.plataformamec.com/";

const URL_BASE = "https://api.plataformamec.com/api/";
const URL_ACCELEROMETER = URL_BASE + "accelerometer";
const URL_ADC = URL_BASE + "adc";
const URL_RTC = URL_BASE + "rtc";
const URL_WIFI = URL_BASE + "wifi";
const URL_CPU = URL_BASE + "cpu";
const URL_BATTERY = URL_BASE + "battery";
const URL_GPS = URL_BASE + "gps";
const URL_LOCATION = URL_BASE + "location";

const URL_AUTH = URL_BASE + "auth";

const URL_UPLOAD = URL_BASE + "upload/file";

const DIR_COMPONENTS = "/home/debian/Sensor-IOT/SensorIoT/componentsFiles/";
const DIR_EVENT_FILE= DIR_COMPONENTS + "events.json";
const DIR_ACCELETOMETER = DIR_COMPONENTS + "accelerometer.json";
const DIR_ADC = DIR_COMPONENTS + "adc.json";
const DIR_RTC = DIR_COMPONENTS + "rtc.json";
const DIR_WIFI = DIR_COMPONENTS + "wifi.json";
const DIR_CPU = DIR_COMPONENTS  + "cpu.json";
const DIR_BATTERY = DIR_COMPONENTS  + "battery.json";
const DIR_GPS = DIR_COMPONENTS + "gps.json";
const DIR_LOCATION = DIR_COMPONENTS + "location.json";

const DIR_TESTS = "/home/debian/Sensor-IOT/SensorIoT/Sensor/tests/";
const DIR_TEST_GPS = DIR_TESTS + "testGps U";
const DIR_TEST_PPS = DIR_TESTS + "testGps P";
const DIR_TEST_RTC = DIR_TESTS + "testRtc I";
const DIR_TEST_SYNC = DIR_TESTS + "testRtc S";
const DIR_TEST_ADC = DIR_TESTS + "testAdc";

const TYPE_TEST =  "TEST";
const TEST_UART = "TEST_UART";
const TEST_PPS = "TEST_PPS";
const TEST_ADC = "TEST_ADC";
const TEST_RTC  = "TEST_RTC";
const TEST_SYNC = "TEST_SYNC";


const TYPE_MAIN = "MAIN";
    /*process*/
const PUT_LOCATION = "PUT_LOCATION_GPS";
const PUT_RTC_DATE = "PUT_RTC_DATEHOUR";
const PUT_SPS = "PUT_SPS";
const ALERTS = "ALERTS_ERROR";
const UPLOAD_FILES = "UPLOAD_FILES";
const REAL_TIME = "REAL_TIME";

const FILE_EVENT = "EVENT";

    /*Tipo de componentes*/
const GPS = "GPS";
const PPS = "PPS";
const RTC = "RTC";
const SYNC = "SYNC";
const ADC = "ADC";
const ACC = "ACC";
const BAT = "BAT";
const WIFI = "WIFI";

module.exports = {
    SOCKET_TOKEN:SOCKET_TOKEN,
    REST_TOKEN: REST_TOKEN,

    ENABLE_REAL_TIME: ENABLE_REAL_TIME,
    AVALIBLE_FOR_REAL_TIME: AVALIBLE_FOR_REAL_TIME,

    CHANGE_SPS_IN_MAIN: CHANGE_SPS_IN_MAIN,

    AXIS: AXIS,

    AXI_X: AXI_X,
    AXI_Y: AXI_Y,
    AXI_Z:AXI_Z,
    ALL_AXIS: ALL_AXIS,

    PATH_FILES: PATH_FILES,
    PATH_MAIN_PROGRAM:PATH_MAIN_PROGRAM,
    URL_AUTH :URL_AUTH,
    PATH_SERIAL : PATH_SERIAL,

    SUCCESS : SUCCESS,
    ERROR : ERROR,

    URL_SOCKET : URL_SOCKET,

    URL_BASE : URL_BASE,
    URL_ACCELEROMETER :URL_ACCELEROMETER,
    URL_ADC :URL_ADC,
    URL_RTC : URL_RTC,
    URL_WIFI :URL_WIFI,
    URL_CPU :URL_CPU,
    URL_BATTERY :URL_BATTERY,
    URL_GPS : URL_GPS,
    URL_LOCATION :URL_LOCATION,
    URL_UPLOAD :URL_UPLOAD,

    DIR_EVENT_FILE: DIR_EVENT_FILE,
    DIR_COMPONENTS :DIR_COMPONENTS,
    DIR_ACCELETOMETER : DIR_ACCELETOMETER,
    DIR_ADC : DIR_ADC,
    DIR_RTC :DIR_RTC,
    DIR_WIFI : DIR_WIFI,
    DIR_CPU : DIR_CPU,
    DIR_BATTERY :DIR_BATTERY,
    DIR_GPS : DIR_GPS,
    DIR_LOCATION : DIR_LOCATION,

    DIR_TESTS :DIR_TESTS,
    DIR_TEST_GPS : DIR_TEST_GPS,
    DIR_TEST_PPS :DIR_TEST_PPS,
    DIR_TEST_RTC : DIR_TEST_RTC,
    DIR_TEST_SYNC : DIR_TEST_SYNC,
    DIR_TEST_ADC :DIR_TEST_ADC,

    TYPE_TEST : TYPE_TEST,
    TEST_UART :TEST_UART,
    TEST_PPS : TEST_PPS,
    TEST_ADC :TEST_ADC,
    TEST_RTC :TEST_RTC,
    TEST_SYNC : TEST_SYNC,


    TYPE_MAIN : TYPE_MAIN,
    /*process*/
    PUT_LOCATION : PUT_LOCATION,
    PUT_RTC_DATE : PUT_RTC_DATE,
    PUT_SPS : PUT_SPS,
    ALERTS : ALERTS,
    UPLOAD_FILES : UPLOAD_FILES,
    REAL_TIME : REAL_TIME,

    FILE_EVENT: FILE_EVENT,

    /*Tipo de componentes*/
    GPS : GPS,
    PPS : PPS,
    RTC : RTC,
    SYNC : SYNC,
    ADC : ADC,
    ACC : ACC,
    BAT : BAT,
    WIFI : WIFI,

};
//const DIR_COMPONENTS = "/home/debian/Sensor-IOT/SensorIoT/componentsFiles/";
//const PATH_SERIAL = "/home/debian/Sensor-IOT/SensorIoT/componentsFiles/serial.txt";
//const PATH_SERIAL = "/home/pru.c";