export const mediaHeader = (header, projectId) => {
  if(!process.server) {
    const headerKey = `project-id-${projectId}`;
    header[headerKey] = projectId;
    if(header.origin){
      header['access-control-request-headers'] = headerKey;
    }
    return header
  }
}
