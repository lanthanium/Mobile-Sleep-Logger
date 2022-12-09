import { Component, Directive, OnInit, Output } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepData } from '../data/sleep-data';
import { async } from 'rxjs';
import {ActionSheetController} from '@ionic/angular';
import { format, parseISO } from 'date-fns';



@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
selectedID:string;
stanfordHistory: StanfordSleepinessData[] = SleepService.AllSleepinessData;
overnightHistory: OvernightSleepData[] = SleepService.AllOvernightData;
allHistory: SleepData[] = SleepService.AllSleepData;
historyTabs:string = 'stanford';




/*********************************************** */
isEditModalOpen:boolean = false;
openStanfordModal?:boolean;
LevelToUpdate: number;
TimeToUpdate: Date;
StanfordToUpdate?:StanfordSleepinessData;
defaultStanfordButton:boolean = true;
stanfordSummary?:boolean;
updatedStanfordButton:boolean = false;
levelString: string = ''; //to be displayed back
timeString: string= ''; //to be displayed back



levelString1 = StanfordSleepinessData.ScaleValues[1];
levelString2 = StanfordSleepinessData.ScaleValues[2];
levelString3 = StanfordSleepinessData.ScaleValues[3];
levelString4 = StanfordSleepinessData.ScaleValues[4];
levelString5 = StanfordSleepinessData.ScaleValues[5];
levelString6 = StanfordSleepinessData.ScaleValues[6];
levelString7 = StanfordSleepinessData.ScaleValues[7];
/************************************************* */




/************************************************* */
openOverNightModal?: boolean;
defaultOverNightButton: boolean = true;
updatedOverNightButton: boolean = false;
sleepStartString: string = ''; //to be displayed back
wakeString: string = ''; //to be displayed back
overNightSummary?: boolean;
sleepTime = new Date;
wakeTime = new Date;
updatedOverNightData?: OvernightSleepData;
overNightError?:boolean;
/*************************************************** */
check1 = false;
check2?:boolean;
check3?:boolean;
check4?:boolean;
check5?:boolean;
check6?:boolean;
check7?:boolean;



  constructor(private sleepService: SleepService, private actionSheet: ActionSheetController) { }
  


  /*********************************************************************************************
   * This function is called by ngOnIt and populates the history html page.  
   * It calls on SleepService's method to push all key objects in Preferences to locally defined 
   * SleepData Arrays
   **********************************************************************************************/
  public populateHistory = async():Promise<void> => {
    if (SleepService.AllSleepData.length ==0) await this.sleepService.downloadAllDataFromPreference();
  }


  /*********************************************************************************************
   * This function is called when a user edits the Stanford Date entry.  
   * Parameters: A time/date in a string format.
   * Function displays back to the user in a formatted date/time the time they selected and creates
   * a Date Object from the time string that was passed as a parmeter, assigns it to history.ts
   * TimeToUpdate, which will be ready to passed into updateStanfordEntry()
   **********************************************************************************************/
  stanfordTimeChanged(time):void 
  {
    this.timeString = format(parseISO(time), 'PPpp'); //to be displayed
    this.TimeToUpdate = new Date(time); //time is in string, new Date() converts it into a Date Object
    console.log(this.TimeToUpdate);
  }



  /*********************************************************************************************
   * This function is called when a user edits the Stanford Level entry 
   * Parameters: A number
   * Function displays back to the user the stanford level statementof the level they selected and creates
   * updates the value of this.LevelToUpdate with the parameter. 
   * this.LevelToUpdate will be ready to passed into updateStanfordEntry()
   **********************************************************************************************/
  levelSelect(value: number) : void
  {
    this.levelString = '' + value + ': ' + StanfordSleepinessData.ScaleValues[value]; // to be displayed
    this.LevelToUpdate = value;
    console.log(this.LevelToUpdate);
  }



  /*********************************************************************************************
   * This function puts a checkmark around selected stanford level during edit page
  **********************************************************************************************/
     addCheck(level:string):void{
      this.check1 = false;
      this.check2 = false;
      this.check3 = false;
      this.check4 = false;
      this.check5 = false;
      this.check6 = false;
      this.check7 = false;
      console.log(level);
      console.log(level.startsWith('1: '));
      if (level.startsWith('1:')) this.check1 = true;
      if (level.startsWith('2:')) this.check2 = true;
      if (level.startsWith('3:')) this.check3 = true;
      if (level.startsWith('4:')) this.check4 = true;
      if (level.startsWith('5:')) this.check5 = true;
      if (level.startsWith('6:')) this.check6 = true;
      if (level.startsWith('7:')) this.check7 = true;
    }



  /*********************************************************************************************
   * This function is called by an html click event, which closes the Stanford Modal
   * When called, it will reset the fields, and the fields into the default state.
   **********************************************************************************************/
  closeStanford():void{
    this.openStanfordModal = false;
    this.levelString = '';
    this.timeString = '';
    this.defaultStanfordButton = true;
    this.updatedStanfordButton = false;
    this.stanfordSummary = false;
    this.check1 = false;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.check5 = false;
    this.check6 = false;
    this.check7 = false;
  }



  /*********************************************************************************************
   * Function is called by click event, when user is ready to submit the updated values to the 
   * database.  
   * Error handling: returns nothing if the user hasn't updated both fields
   * When called, a new StanfordSleepinessData object will be created, it's ID will remain the 
   * same by calling the setID (since this is just an edit and not creating another unique Object)
   * which sets its ID to that of its deleted predecessor.  
   * DeleteALog() will be called, and the ID of the predecessor is passed to the function
   * After that has finished, it calls on SleepService to push the StanfordData Object into Preferences
   * and the locally defined AllSleepData array
   **********************************************************************************************/
  updateStanfordEntry = async() => 
  {
    if (this.levelString == '' || this.timeString == '') return;
    else
    {
      this.stanfordSummary = true;
      this.defaultStanfordButton = false;
      this.updatedStanfordButton = true;
      this.StanfordToUpdate = new StanfordSleepinessData(this.LevelToUpdate, this.TimeToUpdate); 
      this.StanfordToUpdate.setID(this.selectedID);
      await this.deleteALog(this.StanfordToUpdate);
      this.sleepService.addStanfordToPreferences(this.StanfordToUpdate);
      //putting await in front of this.delete fixed this issue where i didn't have to reload the page anymore
      //this.sleepService.downloadAllDataFromPreference();
      
    }
  }



  /*********************************************************************************************
   * This function is called when a user edits the OverNight sleepstart Entry  
   * Parameters: A time/date in a string format.
   * Function displays back to the user in a formatted date/time the time they selected and creates
   * a Date Object from the time string that was passed as a parmeter, assigns it to history.ts
   * sleepTime, which will be ready to passed into updateOverNightEntry()
   **********************************************************************************************/
  sleepTimeChanged(time):void 
  {
    this.sleepTime = new Date(time);
    this.sleepStartString = format(parseISO(time), 'Pp');
  }



  /*********************************************************************************************
   * Same purpose as sleepTimeChange()
   **********************************************************************************************/
  wakeTimeChanged(time):void
  {
    this.wakeTime = new Date(time);
    this.wakeString = format(parseISO(time), 'Pp');
  }



  /*********************************************************************************************
   * Same purpose/logic as closeStanford(), except for the OverNight history page 
   **********************************************************************************************/
  closeOverNightModalID(): void{
    this.openOverNightModal = false;
    this.sleepStartString = '';
    this.wakeString = '';
    this.overNightError = false;
    this.defaultOverNightButton = true;
    this.updatedOverNightButton = false;
    this.overNightSummary = false;
  }



  /*********************************************************************************************
   * Same purpose/logic as updateStanfordEntry, but instead updates OverNightData 
   **********************************************************************************************/
  updateOverNightEntry = async():Promise<void> => {
    if (this.sleepStartString=='' || this.wakeString=='') return;
    if (this.sleepTime.getTime() - this.wakeTime.getTime() > 0)
    {
      this.overNightError = true;
      return;
    }
    else
    {
      this.overNightError = false;
      this.overNightSummary = true;
      this.defaultOverNightButton = false;
      this.updatedOverNightButton = true;
      this.updatedOverNightData = new OvernightSleepData(this.sleepTime, this.wakeTime);
      this.updatedOverNightData.setID(this.selectedID);
      await this.deleteALog(this.updatedOverNightData);
      this.sleepService.addOvernightToStorage(this.updatedOverNightData);
      //this.sleepService.updateAverageSleep();
    }
  }



  /*********************************************************************************************
   * Function is called by updateStanfordEntry() and updateOverNightEntry()
   * Parameters: a SleepData Log
   * Will call on SleepService's method to delete the key:value object from Preferences
   * Then, will loop through all of SleepService's local AllSleepData array and delete the 
   * Object from the array with the corresponding ID
   * Will then loop through either AllStanfordSleepinessData or AllOvernightSleepData arrays, 
   * depending on if the log was an instance of the two, and delete the object from that array
   **********************************************************************************************/
  deleteALog = async(log: SleepData) => {
    await this.sleepService.deleteKey(log.id);
      for (let i = 0; i < SleepService.AllSleepData.length; i++)
      {
        if (log.id == SleepService.AllSleepData[i].id)
        {
          SleepService.AllSleepData.splice(i,1);
          break;
        }
      }
      if (log instanceof OvernightSleepData )
      {
        for (let i = 0; i < SleepService.AllOvernightData.length; i++)
        {
          if (log.id == SleepService.AllOvernightData[i].id)
          {
            SleepService.AllOvernightData.splice(i,1);
            break;
          }
        }
      }
      else if (log instanceof StanfordSleepinessData)
      {
        for (let i = 0; i < SleepService.AllSleepinessData.length; i++)
        {
          if (log.id == SleepService.AllSleepinessData[i].id)
          {
            SleepService.AllSleepinessData.splice(i,1);
            break;
          }
        }
      }
    }


    
  /*********************************************************************************************
   * Function is called by an html button when user wants to edit a log.
   * Log parameter that is passed is the corresponding element in the *ngFor loop from the history
   * page.  From these options, user can delete or edit the log.  Corresponding functions are called
   * from the selection 
   **********************************************************************************************/
  async presentActionSheet(log) {
    const actionSheetCtrl = await this.actionSheet.create({
      header: 'Edit Log',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            //this.setModalID();
            if (log instanceof StanfordSleepinessData) this.openStanfordModal = true;
            else this.openOverNightModal = true;
            //this.openStanfordModal = true;
            //else this.openOverNightModal = true;
            console.log(log);
            this.selectedID = log.id;
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteALog(log);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          }
        }
      ]
    });
    actionSheetCtrl.present();
  }



  /*********************************************************************************************
   * Ignore, Functions below were used for diagnostic testing only
   **********************************************************************************************/
  viewInfo(log){
    console.log(log);
  }
  
  testCard(): void{
    console.log("Testing card ldading")
  }

  async presentOverNightActionSheet(log) {
    const actionSheetCtrl = await this.actionSheet.create({
      header: 'Edit Log',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteALog(log);
          }
        },
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.openOverNightModal = true;
            console.log(log);
            this.selectedID = log.id;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          }
        }
      ]
    });
    actionSheetCtrl.present();
  }

  ngOnInit() {
    this.populateHistory();
    //console.log(SleepService.AllOvernightData);
    //console.log(SleepService.AllSleepinessData);
    //console.log(SleepService.AllSleepData);
    //console.log(this.sortedStanford);
    //this.sleepService.iterateCapacitor();
    //this.sleepService.clearData();
    
  }

}
