export enum TerminalCodes {
  LOGIN_PACKET_REQUEST = 'L',
  LOGIN_PACKET_RESPONSE = 'AL',
  DATA_PACKET_REQUEST = 'D',
  DATA_PACKET_RESPONSE = 'AD',
  PING_PACKET_REQUEST = 'P',
  PING_PACKET_RESPONSE = 'AP',
  SHORT_DATA_PACKET_REQUEST = 'SD',
  SHORT_DATA_PACKET_RESPONSE = 'ASD',
  BLACKBOX_PACKET_REQUEST = 'B',
  BLACKBOX_PACKET_RESPONSE = 'AB',
  DRIVER_MSG_PACKET_REQUEST = 'M',
  DRIVER_MSG_PACKET_RESPONSE = 'AM',
  PHOTO_PACKET_REQUEST = 'I',
  PHOTO_PACKET_RESPONSE = 'AI',
  FIRMWARE_PACKET_REQUEST = 'US',
  CONFIG_PACKET_RESPONSE = 'UC',
}
