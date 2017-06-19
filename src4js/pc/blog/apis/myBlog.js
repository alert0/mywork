import { WeaTools } from 'ecCom'

export const getDatas = params => {
  return WeaTools.callApi('/', 'GET', params)
}

// anruo test api

const testImage = '/messager/usericon/loginid20160219160533.jpg'

// anruo console.log

const Apis = {
  mainPage: {}
}

Apis.mainPage.getIndexInfo = params => {
  //console.log('api getIndexInfo: ', params)
  return Promise.resolve({
    id: 1,
    work: 4.2,
    mood: 2.8
  })
}

Apis.mainPage.getBasicInfo = params => {
  //console.log('api getBasicInfo: ', params)
  return Promise.resolve({
    id: 1,
    url: testImage,
    mainPage: '200',
    weibos: '450',
    fans: '6',
    attentions: '15',
    messages: '2',
    tags: '10'
  })
}

Apis.mainPage.getReceiverList = params => {
  //console.log('api getReceiverList: ', params)
  if (params.currentPage == 1) {
    return Promise.resolve((
      {
        list: [
          {id: 1, url: testImage, name: '徐汝金1', date: '2016-05-06 18:21:00'},
          {id: 2, url: testImage, name: '徐汝金2', date: '2016-04-07 14:11:00'},
          {id: 3, url: testImage, name: '徐汝金3', date: '2016-07-06 11:21:00'},
          {id: 4, url: testImage, name: '徐汝金4', date: '2016-05-09 18:27:00'},
          {id: 5, url: testImage, name: '徐汝金5', date: '2016-12-30 18:21:00'},
        ],
        currentPage: 1,
        totalPage: 2,
        totalSize: 9,
        perPageSize: 5
      }
    ))
  } else {
    return Promise.resolve((
      {
        list: [
          {id: 1, url: testImage, name: '徐汝金6', date: '2016-05-06 18:21:00'},
          {id: 2, url: testImage, name: '徐汝金7', date: '2016-04-07 14:11:00'},
          {id: 3, url: testImage, name: '徐汝金8', date: '2016-07-06 11:21:00'},
          {id: 4, url: testImage, name: '徐汝金9', date: '2016-05-09 18:27:00'}
        ],
        currentPage: 2,
        totalPage: 2,
        totalSize: 9,
        perPageSize: 5
      }
    ))
  }
}

Apis.mainPage.getVisitorList = params => {
  //console.log('api getVisitorList: ', params)
  if (params.currentPage == 1) {
    return Promise.resolve({
      list: [
        {id: 1, url: testImage, name: '罗燕1', date: '2016-05-06 18:21:00'},
        {id: 2, url: testImage, name: '罗燕2', date: '2016-05-06 18:21:00'},
        {id: 3, url: testImage, name: '罗燕3', date: '2016-05-06 18:21:00'},
        {id: 4, url: testImage, name: '罗燕4', date: '2016-05-06 18:21:00'},
        {id: 5, url: testImage, name: '罗燕5', date: '2016-04-07 14:11:00'}
      ],
      currentPage: 1,
      totalPage: 3,
      totalSize: 12,
      perPageSize: 5
    })
  } else if (params.currentPage == 2) {
    return Promise.resolve({
      list: [
        {id: 6, url: testImage, name: '罗燕6', date: '2016-05-06 18:21:00'},
        {id: 7, url: testImage, name: '罗燕7', date: '2016-05-06 18:21:00'},
        {id: 8, url: testImage, name: '罗燕8', date: '2016-05-06 18:21:00'},
        {id: 8, url: testImage, name: '罗燕9', date: '2016-05-06 18:21:00'},
        {id: 10, url: testImage, name: '罗燕10', date: '2016-04-07 14:11:00'}
      ],
      currentPage: 2,
      totalPage: 3,
      totalSize: 12,
      perPageSize: 5
    })
  } else {
    return Promise.resolve({
      list: [
        {id: 11, url: testImage, name: '罗燕11', date: '2016-05-06 18:21:00'},
        {id: 12, url: testImage, name: '罗燕12', date: '2016-04-07 14:11:00'}
      ],
      currentPage: 3,
      totalPage: 3,
      totalSize: 12,
      perPageSize: 5
    })
  }
}

Apis.mainPage.getWeiboList = params => {
  //console.log('api getWeiboList: ', params)
  if(params.anruo < 10){
    if(params.anruo % 2 == 0){
      return Promise.resolve({
        list: [
          {
            date: '2017-05-10 12:11:10', type: 'normal', data: {
            content: <div>'测试1'<br/>'测试1'<br/>'测试1'<br/>'测试1'<br/>'测试1'<br/>'测试1'<br/></div>
          }
          },
          {
            date: '2017-05-09 12:11:10', type: 'expired', data: {
            content: <div>'测试2'<br/>'测试2'<br/>'测试2'<br/>'测试2'<br/>'测试2'<br/>'测试2'<br/></div>
          }
          },
          // {
          //   date: '2017-05-08 12:11:10', type: 'white', data: {
          //   content: <div>'测试3'<br/>'测试3'<br/>'测试3'<br/>'测试3'<br/>'测试3'<br/>'测试3'<br/></div>
          // }
          // },
          // {
          //   date: '2017-05-07 12:11:10', type: 'normal', data: {
          //   content: <div>'测试4'<br/>'测试4'<br/>'测试4'<br/>'测试4'<br/>'测试4'<br/>'测试4'<br/></div>
          // }
          // },
          // {
          //   date: '2017-05-06 12:11:10', type: 'normal', data: {
          //   content: <div>'测试5'<br/>'测试5'<br/>'测试5'<br/>'测试5'<br/>'测试5'<br/>'测试5'<br/></div>
          // }
          // },
          // {
          //   date: '2017-05-05 12:11:10', type: 'normal', data: {
          //   content: <div>'测试6'<br/>'测试6'<br/>'测试6'<br/>'测试6'<br/>'测试6'<br/>'测试6'<br/></div>
          // }
          // },
          // {
          //   date: '2017-05-04 12:11:10', type: 'normal', data: {
          //   content: <div>'测试7'<br/>'测试7'<br/>'测试7'<br/>'测试7'<br/>'测试7'<br/>'测试7'<br/></div>
          // }
          // }
        ],
        startDate: '2017-05-10 12:11:10',
        endDate: '2017-05-04 12:11:10'
      })
    }else{
      return Promise.resolve({
        list:[
          {
            date: '2017-05-03 12:11:10', type: 'normal', data: {
            content: '测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8测试8'
          }
          },
          {
            date: '2017-05-02 12:11:10', type: 'normal', data: {
            content: '测试9'
          }
          },
          {
            date: '2017-05-01 12:11:10', type: 'normal', data: {
            content: '测试10'
          }
          },
          {
            date: '2017-04-30 12:11:10', type: 'normal', data: {
            content: '测试11'
          }
          },
          {
            date: '2017-04-29 12:11:10', type: 'normal', data: {
            content: '测试12'
          }
          },
          {
            date: '2017-04-28 12:11:10', type: 'normal', data: {
            content: '测试13'
          }
          },
          {
            date: '2017-04-27 12:11:10', type: 'normal', data: {
            content: '测试14'
          }
          }
        ],
        startDate: '2017-05-03 12:11:10',
        endDate: '2017-04-27 12:11:10'
      })
    }
  }else{
    return Promise.resolve({
      list:[],
      startDate: '2017-04-27 12:11:10',
      endDate: '2017-04-27 12:11:10'
    })
  }
}

export default Apis

