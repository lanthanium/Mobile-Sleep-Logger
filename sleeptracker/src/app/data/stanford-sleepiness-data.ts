/* from the Stanford Sleepiness Scale */
/* https://web.stanford.edu/~dement/sss.html */

import { SleepData } from './sleep-data';
import { format, parseISO } from 'date-fns';

export class StanfordSleepinessData extends SleepData {
	public static ScaleValues = [undefined,//Sleepiness scale starts at 1
	'Feeling active, vital, alert, or wide awake', //1
	'Functioning at high levels, but not at peak; able to concentrate', //2
	'Awake, but relaxed; responsive but not fully alert', //3
	'Somewhat foggy, let down', //4
	'Foggy; losing interest in remaining awake; slowed down', //5
	'Sleepy, woozy, fighting sleep; prefer to lie down', //6
	'No longer fighting sleep, sleep onset soon; having dream-like thoughts']; //7

	private loggedValue:number;

	constructor(loggedValue:number, loggedAt:Date = new Date()) { //StanfordSleepinessData(3, date)
		super();
		this.loggedValue = loggedValue;
		this.loggedAt = loggedAt;
	}

	summaryString():string {
		return this.loggedValue + ": " + StanfordSleepinessData.ScaleValues[this.loggedValue];
	}

	//here I added a new getter function to spit back the HH:MM AM/PM of the logged date
	loggedAtHours():string{
		//console.log(typeof (format(this.loggedAt, 'p')));
		return format(this.loggedAt, 'p');
		//this.loggedAt.toTimeString().split(' ')[0];
	}

	loggedAtDay():string{
		return format(this.loggedAt, 'PP')
	}

	loggedValueString():string{
		return this.loggedValue.toString();
	}

	//added a getfunction to get the logged value
	getLoggedValue():number{
		return this.loggedValue;
	}

	setID(capacitorId: string){
		this.id = capacitorId;
	}
}
