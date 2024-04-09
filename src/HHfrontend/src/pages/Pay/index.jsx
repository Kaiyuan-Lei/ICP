import React, { useEffect, useState } from 'react'
import { useAuth } from '@/Hooks/useAuth'
import { Principal } from '@dfinity/principal'
import { useSearchParams } from 'react-router-dom'
import { Card, Descriptions, Button } from 'antd'

const Pay = () => {
  const [searchParams] = useSearchParams()
  const { actor, cActor } = useAuth()
  const [info, setInfo] = useState({})

  const getMachineInfo = async () => {
    const id = searchParams.get('id')
    const owner = searchParams.get('owner')
    const _info = await actor.getMachineInfo(Number(id), owner)
    console.log(_info)
    setInfo(_info)
  }

  const approval = async () => {
    console.log('approval')
    //const fee = await cActor.icrc1_fee()
    await cActor.icrc2_approve({
      amount: info.price,
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      expected_allowance: [],
      expires_at: [],
      spender: {
        owner: Principal.fromText(info.owner),
        subaccount: [],
      },
    })
    await handlePay()
    // if approved run handlePay()
  }

  const handlePay = async () => {
    console.log('pay', Number(info.price), info.owner)
    await actor.pay(Number(info.price), info.owner)
  }

  useEffect(() => {
    if (actor && location) {
      getMachineInfo()
    }
  }, [actor, location])
  return (
    <div className="flex justify-center items-center h-full">
      <Card
        className="w-80 min-h-80"
        title={`Pay for ${info.name || ''}`}
        actions={[
          <Button type="primary" onClick={approval}>
            Confirm to pay
          </Button>,
        ]}
      >
        <Descriptions
          column={1}
          items={Object.keys(info).map((item) => ({
            key: item,
            label: item.toLocaleUpperCase(),
            children: info[item].toString(),
          }))}
        />
      </Card>
    </div>
  )
}

export default Pay
