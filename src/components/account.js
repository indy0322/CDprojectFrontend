import React, { useState } from 'react';

function Account() {
  const userEmail = 'novitar289@gmail.com';
  const [language, setLanguage] = useState('English');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setShowDropdown(false);
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
  };

  const infoStyle = {
    marginBottom: '30px',
  };

  const emailStyle = {
    fontSize: '18px',
    color: '#666',
  };

  const sectionsStyle = {
    display: 'grid',
    gap: '20px',
  };

  const sectionStyle = {
    backgroundColor: '#fafafa',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    position: 'relative',
    transition: 'background-color 0.3s ease',
  };

  const sectionHoverStyle = {
    backgroundColor: '#f0f0f0',
  };

  const titleSectionStyle = {
    margin: '0',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  };

  const descriptionStyle = {
    marginTop: '10px',
    fontSize: '14px',
    color: '#888',
  };

  const dropdownStyle = {
    marginTop: '10px',
    padding: '0',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '4px',
    position: 'absolute',
    width: '100%',
    listStyle: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: '100',
  };

  const dropdownItemStyle = {
    padding: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const dropdownItemHoverStyle = {
    backgroundColor: '#f0f0f0',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>계정</h1>
      <div style={infoStyle}>
        <span style={emailStyle}>{userEmail}</span>
      </div>
      <div style={sectionsStyle}>
        <div
          style={showDropdown ? { ...sectionStyle, ...sectionHoverStyle } : sectionStyle}
          onClick={toggleDropdown}
        >
          <h3 style={titleSectionStyle}>언어 변경</h3>
          <p style={descriptionStyle}>현재 언어: {language}</p>
          {showDropdown && (
            <ul style={dropdownStyle}>
              <li style={dropdownItemStyle} onMouseEnter={(e) => e.target.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseLeave={(e) => e.target.style.backgroundColor = ''} onClick={() => selectLanguage('Korean')}>Korean</li>
              <li style={dropdownItemStyle} onMouseEnter={(e) => e.target.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseLeave={(e) => e.target.style.backgroundColor = ''} onClick={() => selectLanguage('English')}>English</li>
              <li style={dropdownItemStyle} onMouseEnter={(e) => e.target.style.backgroundColor = dropdownItemHoverStyle.backgroundColor} onMouseLeave={(e) => e.target.style.backgroundColor = ''} onClick={() => selectLanguage('Japanese')}>Japanese</li>
            </ul>
          )}
        </div>
        <div style={sectionStyle}>
          <h3 style={titleSectionStyle}>비밀번호 변경</h3>
          <p style={descriptionStyle}>비밀번호를 변경하세요</p>
        </div>
      </div>
    </div>
  );
}

export default Account;
