import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Preferences } from '@capacitor/preferences';
import { async } from 'rxjs';
import { parse } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];


	constructor() {
		if(SleepService.LoadDefaultData) {
			this.addDefaultData();
		SleepService.LoadDefaultData = false;
	}
	}

	private addDefaultData() {
		//this.logOvernightData(new OvernightSleepData(new Date('February 18, 2021 01:03:00'), new Date('February 18, 2021 09:25:00')));
		//this.logSleepinessData(new StanfordSleepinessData(4, new Date('February 19, 2021 14:38:00')));
		//this.logOvernightData(new OvernightSleepData(new Date('February 20, 2021 23:11:00'), new Date('February 21, 2021 08:03:00')));
	}

	public logOvernightData(sleepData:OvernightSleepData) { 
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		SleepService.AllOvernightData.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {  
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		SleepService.AllSleepinessData.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
	}


	clearData = async() => {
		await Preferences.clear();
	  }


	/***********************************************************************************************
	Purpose: This function passes in a log id of a sleepData object and deletes the corresponding 
	key:object in Preferences associated with that key. 
	Context: Will be called by the history page when user wants to delete an entry. 
	************************************************************************************************/
	deleteKey = async(id) => {
		await Preferences.remove({key: id})}

	
	
	editKey = async(log) => {
		if (log instanceof StanfordSleepinessData)
		{
			await Preferences.set({
				key: log.id,
				value: JSON.stringify({
					ID: log.id,
					Stanford_Level: log.loggedValueString(),
					Date_String: log.loggedAt.toString()
				})
			})
		}

	}


	/************************************************************************************************
	Purpose: This function passes an OverNightLog and adds it to Preferences Storage using Preference.set
	It uses Overnight methods that get the id, sleepstart and sleepend string and pushes it to 
	the Preference Storage as a JSON object of strings
	After it is done pushing it to Preference, it also pushes the Overnight Object into 
	SleepService's array
	
	Context: Will be called by the logging.ts component
	************************************************************************************************/
	addOvernightToStorage = async(overnight: OvernightSleepData) => {
		await Preferences.set({
			key: overnight.id,
			value: JSON.stringify({
				ID: overnight.id,
				Slept_At: overnight.getSleepStart(),
				Woke_Up_At: overnight.getSleepEnd()
			})
		})
		this.logOvernightData(overnight);}




	/***********************************************************************************************
	Purpose: This function works exactly the same way as addOverNightToStorage except it adds Stanford Data
	Context: Will be called by the sleepiness.ts component
	************************************************************************************************/
	addStanfordToPreferences = async(stanfordLog : StanfordSleepinessData) => {
		await Preferences.set({
		  key: stanfordLog.id,
		  value: JSON.stringify({
			ID: stanfordLog.id,
			Stanford_Level: stanfordLog.loggedValueString(),
			Date_String: stanfordLog.loggedAt.toString()
		  })
		})
		this.logSleepinessData(stanfordLog);}

	


	/***********************************************************************************************
	Purpose: This function obtains all the keys currently stored in Preferences using .keys method and
	store them in a defined array.  Than it will loop through this array, and grab each data object
	in Preferences that has that corresponding key. JSON.parse will be called to convert the stringified
	Data into an Object, and depending on if it's a stanford or overnight object, it will create
	an new object of that type and push it into SleepService's Array of SleepData objects.

	Context: Will be called by the history and analytics page to update SleepService's Array which is  
	then used to populate their pages 
	************************************************************************************************/
	  downloadAllDataFromPreference = async() => {
		let allKeys:{} = await Preferences.keys(); 
		console.log(allKeys);
		if (allKeys["keys"].length)
		{
			for (let i = 0; i < allKeys["keys"].length; i++)
			{
				let {value} = await Preferences.get({key: allKeys["keys"][i]}) //[keys][i] refers to keys[0] etc
				let parsedData = JSON.parse(value);
				console.log(parsedData);
				if ('Stanford_Level' in parsedData)
				{
					let downloadedStanford = new StanfordSleepinessData(Number(parsedData["Stanford_Level"]), new Date(parsedData["Date_String"]));
					downloadedStanford.setID(parsedData["ID"]);
					this.logSleepinessData(downloadedStanford);
				}
				else
				{
					let downloadedOverNight = new OvernightSleepData(new Date(parsedData["Slept_At"]), new Date(parsedData["Woke_Up_At"]));
					downloadedOverNight.setID(parsedData["ID"]);
					this.logOvernightData(downloadedOverNight);
				}
			}
		} 
		else return; }


}


/*


*/