export const mediaHeader = (header, projectId) => {
  if(!process.server) {
    const headerKey = `project-id-${projectId}`;
    header[headerKey] = projectId;
    if(header.origin){
      header['access-control-request-headers'] = headerKey;
    }
    return header
  } else return header
}

export const showSectionsToast = (toast, variant, message, options, extraMessage) => {
  try {
    toast[variant](options && Object.keys(options).length > 0 ? '🔗 ' + message : message, {
      position: "top-right",
      timeout: 5000,
      closeOnClick: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: "button",
      icon: false,
      rtl: false,
      onClick: () => options && Object.keys(options).length > 0 ? window.open(`${options.link.root}${options.link.path}`, '_blank') : {}
    });
  } catch {
    try {
      window.$nuxt.$toast.show(
        {
          message: extraMessage ? extraMessage : message,
          timeout: 5,
          classToast: 'bg-error',
          classMessage: 'text-white',
        }
      )
    } catch {}
  }
}

export const acceptedFileTypes = '.pdf, .doc, .docx, .zip, .json, .css, .scss, .xlsx, .xlsb, .xltx'

export const parseDate = (timestamp) => {
  const timestampInMs = timestamp * 1000;
  const date = new Date(timestampInMs);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
