import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Input,
  Radio,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'

const List = () => {
  const [data, setData] = useState([])
  const [currentRow, setCurrentRow] = useState({})
  const [modalType, setModalType] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Address',
      key: 'address',
      render: (record) => record.owner.address,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <>
          <Tooltip title="Detail">
            <Button
              onClick={() => openViewModal(record)}
              type="link"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Space />
          <Tooltip title="Edit">
            <Button
              onClick={() => openEditModal(record)}
              type="link"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Space />
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record)}
            >
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
          <Space />
          <Tooltip title="Logs">
            <Button type="link" icon={<OrderedListOutlined />} />
          </Tooltip>
        </>
      ),
    },
  ]

  const closeModal = () => {
    setIsOpenModal(false)
    setCurrentRow({})
  }

  const openViewModal = (record) => {
    setIsOpenModal(true)
    setModalType('view')
    setCurrentRow(record)
  }

  const openEditModal = (record) => {
    setIsOpenModal(true)
    setModalType('edit')
    setCurrentRow(record)
  }

  const handleEdit = () => {
    console.log('edit', currentRow)
  }

  const handleDelete = (record) => {
    console.log('Delete', record.id)
  }

  const handleChange = (key, e) => {
    setCurrentRow({ ...currentRow, [key]: e.target.value })
  }

  useEffect(() => {
    const _data = [
      {
        id: 'adfsfsdfadf',
        name: 'Game1',
        price: '1$',
        status: true,
        owner: {
          id: '1',
          name: 'Game place',
          address: 'AAA',
        },
      },
    ]
    setData(_data)
  }, [])
  return (
    <>
      <h1 className=" text-2xl mb-4">List</h1>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal
        open={isOpenModal}
        title={modalType === 'view' ? 'Detail Information' : 'Edit Information'}
        onOk={modalType === 'view' ? closeModal : handleEdit}
        onCancel={closeModal}
      >
        <Form>
          <Form.Item label="ID">{currentRow.id}</Form.Item>
          <Form.Item label="Name">
            <Input
              value={currentRow.name}
              onChange={(e) => handleChange('name', e)}
              disabled={modalType === 'view'}
            />
          </Form.Item>
          <Form.Item label="Address">
            <Input
              value={currentRow.address}
              onChange={(e) => handleChange('address', e)}
              disabled={modalType === 'view'}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Radio.Group
              value={currentRow.status}
              onChange={(e) => handleChange('status', e)}
              disabled={modalType === 'view'}
            >
              <Radio value={true}>Opening</Radio>
              <Radio value={false}>Closed</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Price">
            <Input
              value={currentRow.price}
              onChange={(e) => handleChange('price', e)}
              disabled={modalType === 'view'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default List
