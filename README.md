## Charmviewer

A rich log viewing tool for developers.

## Introduction
While debugging any application, developers are interested in few patterns in the log. Such pattern ranges from a simple search for a keyword to complex combination of strings. Most log viewing tools supports simple keyword search, few gives flexibility to add visual cues so that those log lines catches developers eyes quickly. Very few log viewing tool has support for sharing such patterns with your fellow developers or a new comer to the team. This tool addresses these two pain points. Using this tool you can search complex log patterns and share your search patterns with anyone so that anyone can debug an issue like you.

The tool has two parts, the top section (file view section) shows the contents of the file and the bottom section (filter section) displays the logs matching the bundle/instant query pattern. It is developed using electron and monaco editor same combination as vscode.

## Highlights

Users can store the collection of query pattern in a Bundle. A single query pattern can be a simple string or Users can create a complex string match patterns by combining patterns using AND, OR, NOT (like a lucene query). A bundle can have multiple queries. The best part is Users can share this bundle with his/her fellow developers so that they dont want to recreate a bundle query or enhance the bundle with more queries or remove unwanted ones.

## Bundle
A bundle is a collection of Queries with priorities attached to each. The queries at the top the list has the highest priority and gradually goes down till it reaches the bottom. If a log pattern matches two queries, it will apply the background and foreground color of the higher priority query.

## Features

Opening a file.
Users can simply use the shortcut cmd + O or click on File->Open. This will open the file open dialog box. Select the file that Users want to open and click on open button or simply double click the file.

### Creating an instant query.
	
Users dont need to create a bundle for every search. Users can quickly search using the instant query feature.
  ![QuickFilter_Orig_low](https://user-images.githubusercontent.com/13609496/74095754-1d89ed00-4b1b-11ea-88cf-113755a0c8c3.gif)

### Creating a Bundle
![CreateBundle_480_low](https://user-images.githubusercontent.com/13609496/74095838-65f5da80-4b1c-11ea-88fe-ca629a4fcf2f.gif)

### Exporting a Bundle
Export and share your bundle with your fellow developer or a new comer to your team so that they can also know what patterns to search for in the given scenario and debug like an expert.

![Export_Orig_low](https://user-images.githubusercontent.com/13609496/74095760-37c3cb00-4b1b-11ea-8ade-9ef3a2790d3f.gif)

### Importing a Bundle.
![Import_Orig_low](https://user-images.githubusercontent.com/13609496/74095758-31cdea00-4b1b-11ea-9104-220a41ab9d05.gif)

### Bookmarking a line.
If you click on the gutter, the line will be bookmarked and will be present in the filter section, irrespective of whether it matches with the bundle selection or not.	If you click it the second time, the bookmark will be removed.
![Bookmark_Orig_low_1](https://user-images.githubusercontent.com/13609496/74095792-8d987300-4b1b-11ea-976f-a2893d9ba596.gif)

### Jump
Clicking on anyline in the filtered output will be showing the corresponding line in the file view section.
