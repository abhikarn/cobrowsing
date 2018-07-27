export class config{
  private  static apiMessagingDebug= "ws://localhost:61064/api/messaging";
  private  static apiMessagingLocal="ws://192.168.1.2/test/webapi/api/messaging";
  private  static apiEventDebug="ws://localhost:61064/api/EventMessaging";
  private  static apiEventLocal="ws://192.168.1.2/test/webapi/api/EventMessaging";

  public static MessagingApi=config.apiMessagingDebug;
  public static Eventapi = config.apiEventDebug;

  public static masterContainerId = "mastercontent";

  public static cobrowsingbuttonTextBefore = "collaborate";
  
  public static cobrowsingbuttonTextAfter = "Stop sharing";

  public static mouseimage="";
}