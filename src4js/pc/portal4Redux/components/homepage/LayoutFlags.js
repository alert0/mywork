 import React, {
   Component
 } from 'react';
 //引入元素组件
 import Element from './element/';

 import CustomLayoutFlags from './CustomLayoutFlags';

 const LayoutFlags = ({
   layoutObj
 }) => {
   //定义布局id全局变量
   window.global_bLayoutid = layoutObj.bLayoutid;
   if (layoutObj.layoutHtml !== undefined) {
     window.ifCustomLayoutRender = true;
     return <CustomLayoutFlags hpid={window.global_hpid} layoutObj={layoutObj}/>
   } else {
     return <CommonLayoutFlags layoutObj={layoutObj}/>
   }
 }
 export default LayoutFlags;

 const CommonLayoutFlags = ({
   layoutObj
 }) => {
   const {
     bLayoutid,
     layoutFlags,
     layoutHtml
   } = layoutObj;
   switch (parseInt(bLayoutid)) {
     case 1: //一栏布局
     case 2: //两栏布局
     case 3: //三栏布局
       let lfhtml = <td></td>;
       if (!_isEmptyObject(layoutFlags)) {
         lfhtml = layoutFlags.map((layoutFlag, i) => {
           return <td width={layoutFlag.areasize} className="valign"><GroupDiv key={uuid()} layoutFlag = {layoutFlag}/></td>
         });
       }
       eHtml = <table id="Container">
                <tbody>
               <tr>
                 {lfhtml}
               </tr>
               </tbody>
             </table>
       break;
     case 4: //其他布局1
       eHtml = <SYSOtherRowOne layoutFlags={layoutFlags}/>;
       break;
     case 5: //其他布局2
       eHtml = <SYSOtherRowTwo layoutFlags={layoutFlags}/>;
       break;
     default:
       break;
   }
   return <div>{eHtml}</div>;
 }

 //其他布局1
 const SYSOtherRowOne = ({
   layoutFlags
 }) => {
   const layoutFlag = new Object;
   layoutFlags.map(item => layoutFlag[item.areaflag] = item);
   const aflag = layoutFlag.A;
   const bflag = layoutFlag.B;
   const cflag = layoutFlag.C;
   const dflag = layoutFlag.D;
   return <table id="Container">
        <tr>
          <td width={aflag.areasize} className="valign" >
            <table width="100%" className="valign" border="0" >
              <tr>
                <td colspan="2" className="valign">
                  <GroupDiv layoutFlag={aflag}/>
                </td>
              </tr>
            </table>
            <table width="100%" className="valign" border="0" >
              <tr>
                <td width={cflag.areasize} className="valign" border="0">
                  <GroupDiv layoutFlag={cflag}/>
                </td>
                <td width={dflag.areasize} className="valign" border="0">
                  <GroupDiv layoutFlag={dflag}/>
                </td>
              </tr>
            </table>
          </td>
          <td width={bflag.areasize} className="valign">
            <table width="100%" className="valign"  border="0">
              <tr>
                <td className="valign" >
                  <GroupDiv layoutFlag={bflag}/>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
 }

 //其他布局2
 const SYSOtherRowTwo = ({
   layoutFlags
 }) => {
   const layoutFlag = new Object;
   layoutFlags.map(item => layoutFlag[item.areaflag] = item);
   const aflag = layoutFlag.A;
   const bflag = layoutFlag.B;
   const cflag = layoutFlag.C;
   const dflag = layoutFlag.D;
   return <table id="Container">
            <tr>
              <td width={dflag.areasize} className="valign">
                <table width="100%" className="valign">
                  <tr>
                    <td width={aflag.areasize} className="valign">
                       <GroupDiv layoutFlag={aflag}/>
                    </td>
                     <td width={bflag.areasize} className="valign">
                        <GroupDiv layoutFlag={bflag}/>
                     </td>
                   </tr>
                  </table>
                  <table width="100%" className="valign">
                  <tr className="valign">
                    <td colspan={2} className="valign">
                        <GroupDiv layoutFlag={dflag}/>
                    </td>
                  </tr>
                  </table> </td>
                   <td width={cflag.areasize} className="valign">
                   <table width="100%" className="valign">
                    <tr>
                      <td className="valign">
                        <GroupDiv layoutFlag={cflag}/>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
 }

 //group Div组件
 const GroupDiv = ({
   layoutFlag
 }) => <div className="group" data-areaflag={layoutFlag.areaflag}>
        <div>{layoutFlag.areaElements.map(ele => <Element key={uuid()} ele={ele}/>)}</div>
      </div>