/**
 * modalKey: PageOne
 */

import React from 'react'
import { Drawer } from 'antd'
import { router } from 'umi'

export default () => {
  return (
    <Drawer visible={true} onClose={() => router.go(-1)}>
      page one
    </Drawer>
  )
}
