import { Component, Directive, OnInit, Output } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepData } from '../data/sleep-data';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {

  stanfordHistory: StanfordSleepinessData[] = SleepService.AllSleepinessData; 
  overnightHistory: OvernightSleepData[] = SleepService.AllOvernightData;
  maxOverNight?: OvernightSleepData;

  constructor(private sleepService: SleepService) { }



    /*********************************************************************************************
   * Function is called by ngOnIt to populate the analytics page.  This function will tell
   * SleepService to download all the data from Preference Storage
   **********************************************************************************************/
  public loadAnalytics = async():Promise<void> => {
    if (SleepService.AllSleepData.length == 0) await this.sleepService.downloadAllDataFromPreference();
  }



  /*********************************************************************************************
   * Function calculates the average sleep duration by adding up all the differences and then
   * dividing by length of the overnight array
   **********************************************************************************************/
  public getAvgSleep():string{
    this.getLongestTime();
    let averageTime = 0;
    for (let log of this.overnightHistory)
    {
      averageTime += log.differenceOfTimePositive();
    }
    averageTime = averageTime/this.overnightHistory.length;
    return Math.floor(averageTime / (1000*60*60)) + " hours, " + Math.floor(averageTime / (1000*60) % 60) + " minutes.";
    
  }




  /*********************************************************************************************
   * Function calculates the average stanford level the user logged, rounded to the nearest whole
   * number
   **********************************************************************************************/
  public getAverageEnergy():string{
    let avgStanford: number = 0;
    for (let log of this.stanfordHistory)
    {
      avgStanford += log.getLoggedValue();
    }
    avgStanford = Math.round(avgStanford/(this.stanfordHistory.length));
    return avgStanford.toString() + ': ' +  StanfordSleepinessData.ScaleValues[avgStanford];
  }


  //function was meant to populate the analytics page with the date they slept the longest
  //didn't have time to finish
  public getLongestTime():void{
    let currentMax = 0;
    
    for (let log of this.overnightHistory)
    {
      if (log.differenceOfTimePositive() > currentMax)
      {
        this.maxOverNight = log;
        currentMax = log.differenceOfTimePositive();
      }
    }
   

  }

  ngOnInit() {
    this.loadAnalytics();
  }

}

/*


Make a decision
Based on your history, 
  if good sleep but bad score, fix something else
  if good sleep and good score, great!
  if bad sleep and bad score, sleep more
  if bad sleep and good score, 


*/