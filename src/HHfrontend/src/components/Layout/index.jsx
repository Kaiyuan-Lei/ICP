import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Dropdown, Button } from 'antd'
import {
  DesktopOutlined,
  ClusterOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { useAuth } from '@/Hooks/useAuth'

const { Header, Footer, Sider, Content } = Layout

function App(props) {
  const location = useLocation()
  const { logout, principalId } = useAuth()
  const [currentRoute, setCurrentRoute] = useState('dashboard')

  useEffect(() => {
    setCurrentRoute(location.pathname.split('/')[1] || 'dashboard')
  }, [location])

  return (
    <Layout className=" h-full">
      <Sider className="" collapsible={true}>
        <h1 className=" h-16 leading-10 pt-3 text-lg text-white text-center text-nowrap">
          Playtoken Palace
        </h1>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[currentRoute]}
          mode="inline"
          items={[
            {
              label: <Link to="/">Dashboard</Link>,
              key: 'dashboard',
              icon: <DesktopOutlined />,
            },
            {
              label: <Link to="/list">MachineList</Link>,
              key: 'list',
              icon: <ClusterOutlined />,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className=" text-white flex justify-end items-center">
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <Button type="link" onClick={logout}>
                      Logout
                    </Button>
                  ),
                },
              ],
            }}
            placement="bottomRight"
            trigger="click"
          >
            <Button type="link" className="text-white flex items-center">
              {`${principalId.substring(0, 5)}...${principalId.substr(-3)}`}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Header>
        <Content className="p-5">{props.children || ''}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  )
}
export default App
