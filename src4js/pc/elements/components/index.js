import { ELEMENT_TYPES } from '../constants/ActionTypes';
const { RSS, NEWS, WORKFLOW, CUSTOMPAGE, REPORTFORM, OUTDATA, FORMMODECUSTOMSEARCH,  ADDWF, TASK, BLOGSTATUS, CONTACTS, UNREAD_DOCS, MESSAGE_REMINDING, MY_PROJECTS, NEW_CUSTOMERS, NEW_MEETING, UNREAD_COOPERATION, MONTH_TARGET, DAY_PLAN, SUBSCRIBE_KONWLEDG, MORE_NEWS, MAGAZINE, STOCK, DOC_CONTENT, AUDIO, FAVOURITE, FLASH, PICTURE, MYCALENDAR, IMGSLIDE, NEWNOTICE, OUTTERSYS, SCRATCHPAD, WEATHER, VIDEO, SLIDE, DATACENTER, JOBSINFO, SEARCHENGINE, NOTICE, PLAN, CUSTOMMENU, WORKTASK, MAIL } = ELEMENT_TYPES;
import Workflow from './workflow/';
import MyCalendar from './mycalendar/';
import Rss from './rss/';
import CustomPage from './custompage/';
import News from './news/';
import ReportForm from './reportform/';
import OutData from './outdata/';
import FormModeCustomSearch from './formmodecustomsearch/';
import View from './view/';
import Picture from './picture/';
import MoreNews from './morenews/';
import Stock from './stock/';
import Magazine from './magazine/';
import DocContent from './doccontent/';
import Audio from './audio/';
import Favourite from './favourite/';
import Flash from './flash/';
import ImgSlide from './imgslide/';
import DataCenter from './datacenter';
import Video from './video/';
import Weather from './weather';
import OutterSys from './outtersys/';
import Scratchpad from './scratchpad/';
import Slide from './slide/';
import JobsInfo from './jobsinfo/';
import SearchEngine from './searchengine/';
import CustomMenu from './custommenu/';
import Notice from './notice/';
import Mail from './mail/';
import BlogStatus from './blogstatus/';
import Contacts from './contacts/';
import AddWf from './addwf/';
import Task from './task/';
import NewNotice from './newnotice/';
import WorkTask from './worktask/';
import Plan from './plan/';
import NoReact from './noreact/';
export default class Element extends React.Component {
    render() {
        const { config } = this.props;
        const { eid, ebaseid } = config.item;
        switch (ebaseid) {
            case WORKFLOW:
                return <Workflow key={eid} config={config}/>
            case RSS:
                return <Rss key={eid} config={config}/>
            case CUSTOMPAGE:
                return <CustomPage key={eid} config={config}/>
            case NEWS:
                return <News key={eid} config={config}/>
            case REPORTFORM:
                return <ReportForm key={eid} config={config}/>
            case OUTDATA:
                return <OutData key={eid} config={config}/>
            case FORMMODECUSTOMSEARCH:
                return <FormModeCustomSearch key={eid} config={config}/>
            case UNREAD_DOCS:
            case MESSAGE_REMINDING:
            case MY_PROJECTS:
            case NEW_CUSTOMERS:
            case NEW_MEETING:
            case UNREAD_COOPERATION:
            case MONTH_TARGET:
            case DAY_PLAN:
            case SUBSCRIBE_KONWLEDG:
                return <View key={eid} config={config}/>
            case PICTURE:
                return <Picture key={eid} config={config}/>
            case MORE_NEWS:
                return <MoreNews key={eid} config={config}/>
            case STOCK:
                return <Stock key={eid} config={config}/>
            case MAGAZINE:
                return <Magazine key={eid} config={config}/>
            case DOC_CONTENT:
                return <DocContent key={eid} config={config}/>
            case AUDIO:
                return <Audio key={eid} config={config}/>
            case FAVOURITE:
                return <Favourite key={eid} config={config}/>
            case FLASH:
                return <Flash key={eid} config={config}/>
            case IMGSLIDE:
                return <ImgSlide key={eid} config={config}/>
            case DATACENTER:
                return <DataCenter key={eid} config={config}/>
            case VIDEO:
                return <Video key={eid} config={config}/>
            case WEATHER:
                return <Weather key={eid} config={config}/>
            case OUTTERSYS:
                return <OutterSys key={eid} config={config}/>
            case SCRATCHPAD: 
                return <Scratchpad key={eid} config={config}/>
            case SLIDE:
                return <Slide key={eid} config={config}/>
            case JOBSINFO:
                return <JobsInfo key={eid} config={config}/>
            case SEARCHENGINE:
                return <SearchEngine key={eid} config={config}/>
            case CUSTOMMENU:
                return <CustomMenu key={eid} config={config}/>
            case NOTICE:
                return <Notice key={eid} config={config}/>
            case MAIL:
                return <Mail key={eid} config={config}/>
            case BLOGSTATUS:
                return <BlogStatus key={eid} config={config}/>
            case CONTACTS:
                return <Contacts key={eid} config={config}/>
            case ADDWF:
                return <AddWf key={eid} config={config}/>
            case TASK:
                return <Task key={eid} config={config}/>
            case NEWNOTICE:
                return <NewNotice key={eid} config={config}/>
            case WORKTASK:
                return <WorkTask key={eid} config={config}/>
            case PLAN:
                return <Plan key={eid} config={config}/>
            case MYCALENDAR: 
                return <MyCalendar key={eid} config={config}/>
            default:
                return <NoReact key={eid} config={config}/>
        }
    }
}
