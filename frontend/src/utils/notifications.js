/**
 * Custom notification utility to replace browser's alert() and confirm()
 * Provides better UX without "localhost:3000 says" message
 */

// Create notification container if it doesn't exist
const createNotificationContainer = () => {
  let container = document.getElementById('notification-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'notification-container'
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `
    document.body.appendChild(container)
  }
  return container
}

// Show alert notification
export const showAlert = (message, type = 'info') => {
  return new Promise((resolve) => {
    const container = createNotificationContainer()
    
    const notification = document.createElement('div')
    notification.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      border-left: 4px solid ${getColorForType(type)};
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
    `
    
    const icon = getIconForType(type)
    
    notification.innerHTML = `
      <div style="display: flex; align-items: start; gap: 12px;">
        <div style="font-size: 24px; flex-shrink: 0;">${icon}</div>
        <div style="flex: 1;">
          <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.5;">${message}</p>
          <button id="ok-btn" style="
            margin-top: 12px;
            background: ${getColorForType(type)};
            color: white;
            border: none;
            padding: 8px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
          ">OK</button>
        </div>
      </div>
    `
    
    container.appendChild(notification)
    
    const okBtn = notification.querySelector('#ok-btn')
    okBtn.addEventListener('mouseenter', () => {
      okBtn.style.transform = 'scale(1.05)'
      okBtn.style.opacity = '0.9'
    })
    okBtn.addEventListener('mouseleave', () => {
      okBtn.style.transform = 'scale(1)'
      okBtn.style.opacity = '1'
    })
    
    okBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        container.removeChild(notification)
        resolve(true)
      }, 300)
    })
  })
}

// Show confirm dialog
export const showConfirm = (message) => {
  return new Promise((resolve) => {
    const container = createNotificationContainer()
    
    const notification = document.createElement('div')
    notification.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      border-left: 4px solid #f59e0b;
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
    `
    
    notification.innerHTML = `
      <div style="display: flex; align-items: start; gap: 12px;">
        <div style="font-size: 24px; flex-shrink: 0;">⚠️</div>
        <div style="flex: 1;">
          <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.5; margin-bottom: 12px;">${message}</p>
          <div style="display: flex; gap: 8px;">
            <button id="cancel-btn" style="
              flex: 1;
              background: #e5e7eb;
              color: #374151;
              border: none;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s;
            ">Cancel</button>
            <button id="confirm-btn" style="
              flex: 1;
              background: #ef4444;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s;
            ">Confirm</button>
          </div>
        </div>
      </div>
    `
    
    container.appendChild(notification)
    
    const cancelBtn = notification.querySelector('#cancel-btn')
    const confirmBtn = notification.querySelector('#confirm-btn')
    
    const addHoverEffect = (btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)'
        btn.style.opacity = '0.9'
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)'
        btn.style.opacity = '1'
      })
    }
    
    addHoverEffect(cancelBtn)
    addHoverEffect(confirmBtn)
    
    const closeNotification = (result) => {
      notification.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        container.removeChild(notification)
        resolve(result)
      }, 300)
    }
    
    cancelBtn.addEventListener('click', () => closeNotification(false))
    confirmBtn.addEventListener('click', () => closeNotification(true))
  })
}

// Helper functions
const getColorForType = (type) => {
  switch (type) {
    case 'success': return '#10b981'
    case 'error': return '#ef4444'
    case 'warning': return '#f59e0b'
    default: return '#3b82f6'
  }
}

const getIconForType = (type) => {
  switch (type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    default: return 'ℹ️'
  }
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(-100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100px);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

