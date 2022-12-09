import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	private sleepStart:Date;
	private sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.loggedAt = sleepStart;
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}

	summaryString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;
		    
		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	//adding a new get function to get the difference.  I will use this for error checking
	differenceOfTime():number{
		return this.sleepStart.getTime() - this.sleepEnd.getTime();
	}

	differenceOfTimePositive():number{
		return this.sleepEnd.getTime() - this.sleepStart.getTime();
	}

	dateString():string {
		return this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	timeString():string{
		return this.sleepStart.toLocaleTimeString('en-us') + ' to ' + this.sleepEnd.toLocaleTimeString('en-us');
	}

	getSleepStart():string{
		return this.sleepStart.toString();
	}

	getSleepEnd():string{
		return this.sleepEnd.toString();
	}
}