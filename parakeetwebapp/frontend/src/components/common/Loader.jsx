import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

export default function Loader() {
    return <div>
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <Flex align="center" gap="middle">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 70 }} spin />} />
            </Flex>
            <p className="text-blue-600 text-lg font-medium">Loading...</p>
        </div>
    </div>
}