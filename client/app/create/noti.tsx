import React, { useState } from 'react';
import {
    Space, Button, Checkbox
} from 'antd';

import { NotificationInstance } from 'antd/es/notification/interface';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Interface {
    noti: NotificationInstance;
    data: any;
    changingVis: boolean;
    dataArray: any;
    setDataArray: (dataArray: []) => void;
    setChangingVis: (changingVis: boolean) => void;
    prepareMinting: string;
}

// change visibility of a piece of art
const handleVisibility = ({ noti, data, changingVis, dataArray, setDataArray, setChangingVis, prepareMinting }: Interface) => {
    const change = async () => {
        try {
            // call api to change visibility in database
            const response = await fetch(`/api/publicGallery/${data._id}`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                const message = `An error has occurred: ${response.status}`;
                throw new Error(message);
            }

            const result = await response.json();
            // Create a new array with the updated item
            const newDataArray = dataArray.map((item: any) =>
                item._id === data._id ? { ...item, shared: result } : item
            );
            setDataArray(newDataArray);

            noti['success']({
                message: 'Message:',
                description:
                    `Visibility changed.`,
                duration: 1,
            });
            setChangingVis(false);
        } catch (error) {
            noti['error']({
                message: 'Message:',
                description:
                    `${error}`,
                duration: 3,
            });
            setChangingVis(false);
        }
    }

    // one piece of art minting at one time
    if (prepareMinting === data._id) {
        noti['info']({
            message: 'Message:',
            description:
                'Can not change visibility when minting.',
            duration: 4,
        });
        return;
    }

    setChangingVis(true);
    change();
}

const onChange = (e: CheckboxChangeEvent) => {
    const show = !e.target.checked;
    localStorage.setItem('__showVisNotification', show.toString());
};

const openVisNotification = ({
    noti, data, changingVis,
    dataArray, setDataArray,
    setChangingVis, prepareMinting
}: Interface) => {
    let isButtonDisabled = false; // Add this line

    const key = `openVisNotification`;
    const storedValue = localStorage.getItem('__showVisNotification');

    if (storedValue === 'false' || data.shared) {
        handleVisibility({ noti, data, changingVis, dataArray, setDataArray, setChangingVis, prepareMinting });
    } else {
        setChangingVis(true);

        let _continueButton = false;

        const btn = (
            <Space>
                <Checkbox onChange={onChange}>{"Don't show again"} </Checkbox>
                <Button
                    type="default"
                    size="small"
                    disabled={isButtonDisabled}
                    onClick={() => {
                        _continueButton = true;

                        noti.destroy(key);

                        handleVisibility({
                            noti, data, changingVis, dataArray, setDataArray, setChangingVis, prepareMinting
                        })
                    }}>
                    Continue
                </Button>
            </Space >
        );

        noti.warning({
            message: `Caution ${data.title ? data.title + '.' : '.'}`,
            description:
                'By proceeding, your art becomes discoverable by others. Your prompt and generation parameters may be utilized by fellow creators. If you genuinely wish to share, simply press continue',
            btn,
            key,
            placement: 'topRight',
            onClose: () => { if (!_continueButton) setChangingVis(false); },
            duration: 0
        });
    }
};

export default openVisNotification;