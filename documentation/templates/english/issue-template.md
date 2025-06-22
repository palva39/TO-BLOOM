# Issue Template

## Title
_What is the short, descriptive title for this issue or feature?_

### Description
_Describe the feature or issue in detail._

**Narrative Example:**
Jane is a frequent customer who often forgets what she ordered last time. When she logs in, she should see a list of her previous orders, each with details and a "Reorder" button. This will help her quickly repeat past purchases, improving her experience and increasing sales.
<small>(Example only. Replace with your actual description and narrative.)</small>

---

## User Stories Covered
_Which user stories does this issue address? List by number and copy their text from user-stories-template.md._

- US-001: As a customer, I want to see my past orders so I can remember what I bought.  
- US-005: As a customer, I want to view the details of a specific order.  
  <small>(Examples only. Replace with your actual user stories.)</small>

_See `user-stories-template.md`._

---

## Requirements & Supporting Documents
_Which documents support this issue? default path is documentation/planning/_
- documentation/planning/project-requirements.md
- documentation/planning/ui-wireframes.md
- documentation/planning/database-schema.md
- documentation/planning/api.md
  <small>(Examples only. Replace with your actual user stories.)</small>
---

## Acceptance Criteria
_What must be true for this issue to be considered complete?_
- [ ] All user stories listed above are fully implemented and testable.
- [ ] UI matches provided wireframes.
- [ ] Data is loaded from the backend, using schema and API contracts as specified.
- [ ] Handles loading, error, and empty states gracefully.
- [ ] (Add any additional, specific criteria relevant to this feature.)
  <small>(Examples only. Replace with your actual user stories.)</small>
---

## Dependencies
_What other issues or features must be completed first?_
- Depends on:
  - US-008: User authentication
  - US-010: Order API backend available  
    <small>(Example only. Replace as needed.)</small>

---

## Stubbing & Mocks
_If dependencies are not ready, what stubs or mock data can be used to proceed? use documentaition as a contract_


## Seperation of Concerns (Preventing Merge Conflicts!)
_What parts of the codebase will this issue affect?_


## Guidlines for saving Documentation
_*This should be pressent and unchanged in all issues*_

Where Should Documentation Be Saved?
- **New Features**: If a new feature is created, document the feature in a Markdown file and save it inside the `documentation/docs` folder. The file name should be descriptive of the feature (e.g., `feature-name.md`).
- **Edited Features**: If an existing feature is edited, locate the corresponding Markdown file in the `documentation/docs` folder and update it with the changes.

Steps for Committing Changes and Creating a Pull Request

1. **Navigate to the External Docs Repository**:
   - Ensure you are working within the `documentation` repository.
   - cd into the nested repository:
     ```bash
     cd documentation
     ```

2. **Add or Edit Documentation**:
   - For new features:
     - Create a new Markdown file in the `documentation/docs` folder.
     - Write detailed documentation about the feature, including its purpose, functionality, and usage instructions.
   - For edited features:
     - Locate the existing Markdown file in the `documentation/docs` folder.
     - Update the file with the relevant changes.

3. **Stage the Changes**:
   - Run the following command to stage the changes:
     ```bash
     git add docs/
     ```

4. **Commit the Changes**:
   - Use a descriptive commit message to explain the changes:
     ```bash
     git commit -m "Add/Edit documentation for [feature-name]"
     ```

4. **Push the Changes to a New Branch**:
   - Create a new branch for the changes:
     ```bash
     git checkout -b feature-doc-update
     ```
   - Push the branch to the remote repository:
     ```bash
     git push -u origin feature-doc-update
     ```

## Notes
- Ensure all documentation is clear, concise, and follows the formatting guidelines of the repository.
