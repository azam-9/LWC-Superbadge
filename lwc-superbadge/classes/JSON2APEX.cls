/**
 * @description       : 
 * @author            : Sohail Azam
 * @group             : 
 * @last modified on  : 08-03-2022
 * @last modified by  : Sohail Azam
**/
public with sharing class JSON2APEX {

	public class Sender {
		public String SenderID;
	}

	public class Target {
		public String TargetID;
	}

	public class DataArea {
		public String id;
		public String timestamp;
		public String dsID;
		public String createDate;
		public String workOrder;
		public String esn;
		public String dsStatus;
		public String dsClosureType;
		public String nbSearches;
		public String accessSRTID;
		public String faliurePoint;
		public String faliureMeasure;
		public String manufacturer;
		public String modelSeries;
		public String unitNumber;
		public String customerName;
		public String application;
		public String faultCode;
		public List<Event> event;
	}

	public Header Header;
	public DataArea DataArea;

	public class Header {
		public Sender Sender;
		public Target Target;
	}

	public class Event {
		public String solutionId;
		public String solutionSeq;
		public String searchNumber;
		public String searchCompleted;
		public String verificationStatus;
		public String repairStatus;
		public String timestamp;
		public String informationType;
		public String componentID;
	}

	
	public static JSON2APEX parse(String json) {
		return (JSON2APEX) System.JSON.deserialize(json, JSON2APEX.class);
	}
}
}
