/**
 * modalKey: PageOne
 */

import React from 'react'
import { Drawer } from 'antd'
import { history } from 'umi'

const PageOne = () => {
  return (
    <Drawer visible={true} onClose={() => history.go(-1)}>
      page one
    </Drawer>
  )
}

PageOne.title = 'xx'

export default PageOne
