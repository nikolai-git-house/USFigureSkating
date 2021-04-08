# General Integration - Release 2
This document outlines integration notes for release 2.

## Competition Contacts
In the template for competition contacts(`src/views/pages/E.2.1_Competition-contacts.php`), the lead text link target 
needs to be implemented.  This segment has been identified with an `@integration` code comment.

## My Skaters
Recommendation to put server side middleware in place to redirect users that are not coaches from directly accessing my skaters page.

## Competition Information
The Competition Information object has been modified to include the following data points (new data structures are outlined in INTEGRATION-API-R2.md):

```  
music_ppc_deadline_description: string;            - Text content to be included in the "Music & PPC Deadlines" dropdown on the Music & PPC page
ppc_deadline: MusicPPCDeadlineInfo | null          - Information about the competition's PPC deadlines.  Nullable
music_deadline: MusicPPCDeadlineInfo | null        - Information about the competition's Music deadlines.  Nullable
```


