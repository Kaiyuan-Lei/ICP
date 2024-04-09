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
  QRCode,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useAuth } from '@/Hooks/useAuth'

const List = () => {
  const { actor } = useAuth()
  const [data, setData] = useState([])
  const [currentRow, setCurrentRow] = useState({})
  const [modalType, setModalType] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value) => value.toString(),
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
      render: (value) => value.toString(),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (value ? 'Running' : 'Stopped'),
    },
    {
      title: 'QR Code',
      key: 'qr',
      render: (record) => (
        <Link to={`/pay?id=${record.id}&owner=${record.owner}`}>
          <QRCode
            value={`http://localhost:8080/pay?id=${record.id}&owner=${record.owner}`}
          />
        </Link>
      ),
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
          {/* <Tooltip title="Edit">
            <Button
              onClick={() => openEditModal(record)}
              type="link"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Space /> */}
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
          {/* <Space />
          <Tooltip title="Logs">
            <Button type="link" icon={<OrderedListOutlined />} />
          </Tooltip> */}
        </>
      ),
    },
  ]

  const ModalTitles = {
    view: 'Detail Info',
    edit: 'Edit Info',
    add: 'Add Info',
  }

  const getList = async () => {
    const list = await actor.machineList()
    console.log(BigInt(list[0].id))
    setData(list)
  }

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

  const openAddModal = () => {
    setIsOpenModal(true)
    setModalType('add')
    setCurrentRow({})
  }

  const handleEdit = async () => {
    console.log('edit', currentRow)
  }

  const handleDelete = (record) => {
    console.log('Delete', record.id)
  }

  const handleAdd = async () => {
    await actor.addMachine(
      data.length + 1,
      currentRow.name,
      Number(currentRow.price),
    )
    closeModal()
    getList()
  }

  const handleChange = (key, e) => {
    setCurrentRow({ ...currentRow, [key]: e.target.value })
  }

  const handleConfirmModal = () => {
    switch (modalType) {
      case 'view':
        closeModal()
        break
      case 'edit':
        handleEdit(currentRow)
        break
      case 'add':
        handleAdd(currentRow)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (actor) {
      getList()
    }
  }, [actor])

  return (
    <>
      <h1 className=" text-2xl mb-4 flex justify-between items-center">
        Machine List
        <Button type="primary" onClick={openAddModal}>
          Add Machine
        </Button>
      </h1>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal
        open={isOpenModal}
        title={ModalTitles[modalType]}
        onOk={handleConfirmModal}
        onCancel={closeModal}
      >
        <Form>
          {modalType !== 'add' && (
            <Form.Item label="ID">{currentRow.id?.toString()}</Form.Item>
          )}
          <Form.Item label="Name">
            <Input
              value={currentRow.name}
              onChange={(e) => handleChange('name', e)}
              disabled={modalType === 'view'}
            />
          </Form.Item>
          {modalType === 'view' && (
            <Form.Item label="Owner">
              <Input
                value={currentRow.owner}
                onChange={(e) => handleChange('owner', e)}
                disabled={modalType === 'view'}
              />
            </Form.Item>
          )}
          {modalType === 'view' && (
            <Form.Item label="Status">
              <Radio.Group
                value={currentRow.status}
                onChange={(e) => handleChange('status', e)}
                disabled={modalType === 'view'}
              >
                <Radio value={true}>Running</Radio>
                <Radio value={false}>Stopped</Radio>
              </Radio.Group>
            </Form.Item>
          )}
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
