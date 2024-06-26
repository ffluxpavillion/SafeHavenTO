import './FilterButtons.scss';
import React, { useState, useEffect } from 'react';
import { Popover, Button, Radio, Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const FilterButtons = ({ selectedFilters, updateFilters }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showPopover = () => {
    setVisible(!visible);
  };

  const handleChange = (filterType, value) => {
    updateFilters(filterType, value);
  };

  const content = (
    <Space direction='vertical' size='large' style={{ width: '250px' }}>
      <div>
        <h4>Capacity Type</h4>
        <Radio.Group
          defaultValue='All'
          onChange={(e) => handleChange('capacityType', e.target.value)}
        >
          <Radio.Button
            className='filter-capacity-type__radio'
            style={{}}
            value='All'
          >
            Any
          </Radio.Button>
          <Radio.Button
            className='filter-capacity-type__radio'
            style={{ width: '100%', borderRadius: '5px' }}
            value='Bed Based Capacity'
          >
            Beds Only
          </Radio.Button>
          <Radio.Button
            className='filter-capacity-type__radio'
            style={{ width: '100%', borderRadius: '5px' }}
            value='Room Based Capacity'
          >
            Rooms Only
          </Radio.Button>
        </Radio.Group>
      </div>

      <div>
        <h4>Category</h4>
        <Select
          defaultValue='All'
          style={{ width: '100%' }}
          onChange={(value) => handleChange('sector', value)}
        >
          <Option value='All'>All</Option>
          <Option value='Families'>Families</Option>
          <Option value='Men'>Men</Option>
          <Option value='Mixed Adult'>Mixed Adult (co-ed or all gender)</Option>
          <Option value='Women'>Women</Option>
          <Option value='Youth'>Youth</Option>
        </Select>
      </div>

      <div>
        <h4>Program Type</h4>
        <Select
          defaultValue='All'
          style={{ width: '100%' }}
          onChange={(value) => handleChange('programModel', value)}
        >
          <Option className='filter-program-type__option' value='All'>
            All Models
          </Option>
          <Option className='filter-program-type__option' value='Emergency'>
            Emergency (No Referral Needed)
          </Option>
          <Option className='filter-program-type__option' value='Transitional'>
            Transitional (Referral Required)
          </Option>
        </Select>
      </div>

      {/* <div>
        <h4>Overnight Service Type</h4>
        <Select
          defaultValue="All"
          style={{ width: '100%' }}
          onChange={(value) => handleChange('overnightServiceType', value)}
        >
          <Option value="All">Any Overnight Service Type</Option>
          <Option value="24-Hour Respite Site">24-Hour Respite Site</Option>
          <Option value="24-Hour Women's Drop-in">24-Hour Women's Drop-in</Option>
          <Option value="Alternative Space Protocol">Alternative Space Protocol</Option>
          <Option value="Interim Housing">Interim Housing</Option>
          <Option value="Isolation/Recovery Site">Isolation/Recovery Site</Option>
          <Option value="Motel/Hotel Shelter">Motel/Hotel Shelter</Option>
          <Option value="Shelter">Shelter</Option>
          <Option value="Top Bunk Contingency Space">Top Bunk Contingency Space</Option>
          <Option value="Warming Centre">Warming Centre</Option>
        </Select>
      </div> */}

      <div>
        <h4>City</h4>
        <Select
          defaultValue='All'
          style={{ width: '100%' }}
          onChange={(value) => handleChange('locationCity', value)}
        >
          <Option value='All'>All Locations</Option>
          <Option value='Etobicoke'>Etobicoke</Option>
          <Option value='North York'>North York</Option>
          <Option value='Scarborough'>Scarborough</Option>
          <Option value='Toronto'>Toronto</Option>
          <Option value='Vaughan'>Vaughan</Option>
        </Select>
      </div>

      {/* <div>
        <h4>Availability</h4>
        <Radio.Group
          defaultValue="All"
          onChange={(e) => handleChange('occupancyRate', e.target.value)}
        >
          <Radio.Button value="All">Any Occupancy</Radio.Button>
          <Radio.Button value="100">100% Full</Radio.Button>
          <Radio.Button value="Available">Not Full</Radio.Button>
        </Radio.Group>
      </div> */}
    </Space>
  );

  return (
    <>
      <Popover
        content={content}
        title='Filter Options'
        trigger='click'
        visible={visible}
        onVisibleChange={setVisible}
        placement='bottom'
        className='filter-popover'
        arrow={false}
        style={{ width: '30rem' }}
      >
        <Button
          className='filter-primary-button'
          type='primary'
          icon={<FilterOutlined />}
          onClick={showPopover}
        >
          Filters
        </Button>
      </Popover>
    </>
  );
};

export default FilterButtons;
