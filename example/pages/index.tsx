import React from 'react'
import { history } from 'umi'
import { Button } from 'antd'

export default () => {
  return (
    <ul>
      <li>
        <Button
          onClick={() => {
            history.push({
              pathname: '/modal-page/pageone',
              search: 'modalKey=PageOne',
            })
          }}
        >
          弹窗
        </Button>
      </li>
      <li>
        <Button
          onClick={() => {
            history.push({
              pathname: '/normal-page/pageone',
            })
          }}
        >
          普通
        </Button>
      </li>
    </ul>
  )
}
